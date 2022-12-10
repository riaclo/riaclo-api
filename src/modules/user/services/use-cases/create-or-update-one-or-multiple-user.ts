import { FindOneUserByService } from '../query/find-one-user-by.service';
import { CreateOrUpdateUserService } from '../mutations/create-or-update-user.service';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateOneUserDto,
  ConfirmOneRegisterCreateUserDto,
} from '../../dto/validation-user.dto';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateContributorService } from '../../../contributor/services/mutations/create-or-update-contributor.service';
import { FindOneCurrencyByService } from '../../../currency/services/query/find-one-currency-by.service';
import { getOneLocationIpApi } from '../../../integrations/ip-api/api/index';
import { FindOneCountryByService } from '../../../country/services/query/find-one-country-by.service';
import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';

@Injectable()
export class CreateOrUpdateOneOrMultipleUser {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly findOneCountryByService: FindOneCountryByService,
    private readonly findOneCurrencyByService: FindOneCurrencyByService,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly createOrUpdateProfileService: CreateOrUpdateProfileService,
    private readonly createOrUpdateContributorService: CreateOrUpdateContributorService,
  ) {}

  /** Create one register to the database. */
  async createOne(options: CreateOneUserDto): Promise<any> {
    const { email, firstName, lastName, roleId, ipLocation, userAgent, user } =
      {
        ...options,
      };

    /** Find currency */
    const findIpLocation = await getOneLocationIpApi({ ipLocation });
    /** Find one currency */
    const [_errorC, currency] = await useCatch(
      this.findOneCurrencyByService.findOneBy({
        option2: { code: findIpLocation?.currency },
      }),
    );
    if (_errorC) {
      throw new NotFoundException(_errorC);
    }

    /** Find one country */
    const [_errorCt, country] = await useCatch(
      this.findOneCountryByService.findOneBy({
        option2: { code: findIpLocation?.countryCode },
      }),
    );
    if (_errorCt) {
      throw new NotFoundException(_errorCt);
    }

    /** Find one user */
    const [_error, findOneUser] = await useCatch(
      this.findOneUserByService.findOneBy({ option2: { email } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (findOneUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const [errorP, profile] = await useCatch(
      this.createOrUpdateProfileService.createOne({
        lastName,
        firstName,
        countryId: country?.id,
        currencyId: currency?.id,
      }),
    );
    if (errorP) {
      throw new NotFoundException(errorP);
    }

    /** Save user */
    const newPassword = generateLongUUID(8);
    const [errorU, saveOneUser] = await useCatch(
      this.createOrUpdateUserService.createOne({
        email,
        profileId: profile?.id,
        password: newPassword,
        noHashPassword: newPassword,
        organizationInUtilizationId: user?.organizationInUtilizationId,
      }),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    /** Create contributor */
    const [__SB, _contributor] = await useCatch(
      this.createOrUpdateContributorService.createOne({
        contributeType: 'ORGANIZATION',
        contributeId: user?.organizationInUtilization?.id,
        organizationId: user?.organizationInUtilization?.id,
        userCreatedId: user?.id,
        userId: saveOneUser?.id,
        roleId: roleId,
      }),
    );
    if (__SB) {
      throw new NotFoundException(__SB);
    }

    return {
      id: saveOneUser?.id,
      email: saveOneUser?.email,
      token: saveOneUser?.token,
      organizationInUtilization: user?.organizationInUtilization,
    };
  }

  /** Update  to the database. */
  async updateOneUserCreate(
    options: ConfirmOneRegisterCreateUserDto,
  ): Promise<any> {
    const { firstName, lastName, password, token } = {
      ...options,
    };

    /** Find one user */
    const [_error, findOneUser] = await useCatch(
      this.findOneUserByService.findOneBy({ option5: { token } }),
    );
    if (_error) {
      throw new NotFoundException(_error);
    }
    if (!findOneUser)
      throw new HttpException(`User or token not found`, HttpStatus.NOT_FOUND);

    /** Create Profile */
    const [errorP, updateProfile] = await useCatch(
      this.createOrUpdateProfileService.updateOne(
        { option1: { profileId: findOneUser?.profileId } },
        { lastName, firstName },
      ),
    );
    if (errorP) {
      throw new NotFoundException(errorP);
    }

    /** Save user */
    const [errorU, updateOneUser] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option1: { userId: findOneUser?.id } },
        { password: password, noHashPassword: null, confirmedAt: new Date() },
      ),
    );
    if (errorU) {
      throw new NotFoundException(errorU);
    }

    return {
      id: updateOneUser?.id,
      firstName: updateProfile?.firstName,
      lastName: updateProfile?.lastName,
    };
  }
}
