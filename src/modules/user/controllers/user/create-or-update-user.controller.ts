import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';
import {
  Controller,
  Get,
  Param,
  Response,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
  ParseBoolPipe,
  Post,
  Headers,
} from '@nestjs/common';
import { reply } from '../../../../infrastructure/utils/reply';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateUserService } from '../../services/mutations/create-or-update-user.service';
import {
  CreateOneUserDto,
  UpdateEmailUserDto,
  UpdateInfoUserDto,
} from '../../dto/validation-user.dto';
import * as amqplib from 'amqplib';
import { UpdateOrganizationToUser } from '../../services/use-cases/update-organization-to-user';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';
import { UpdateChangePasswordUserDto } from '../../dto/validation-user.dto';
import { ChangePasswordUser } from '../../services/use-cases/change-password-user';
import { UpdateInformationToUser } from '../../services/use-cases/update-information-to-user';
import { CreateOrUpdateProfileDto } from '../../../profile/dto/validation-profile.dto';
import { CreateOrUpdateProfileService } from '../../../profile/services/mutations/create-or-update-profile.service';
import { CreateOrUpdateOneOrMultipleUser } from '../../services/use-cases/create-or-update-one-or-multiple-user';
import { getIpRequest } from '../../../../infrastructure/utils/commons/get-ip-request';
import { authNewUserCreateJob } from '../../jobs/auth-login-and-register-job';
import { configurations } from '../../../../infrastructure/configurations/index';

@Controller('users')
export class CreateOrUpdateUserController {
  constructor(
    private readonly changePasswordUser: ChangePasswordUser,
    private readonly updateInformationToUser: UpdateInformationToUser,
    private readonly updateOrganizationToUser: UpdateOrganizationToUser,
    private readonly createOrUpdateUserService: CreateOrUpdateUserService,
    private readonly createOrUpdateOneOrMultipleUser: CreateOrUpdateOneOrMultipleUser,
    private readonly createOrUpdateProfileService: CreateOrUpdateProfileService,
  ) {}

  @Post(`/create`)
  @UseGuards(JwtAuthGuard)
  async createOneUser(
    @Res() res,
    @Req() req,
    @Body() createOneUserDto: CreateOneUserDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.createOrUpdateOneOrMultipleUser.createOne({
        ...createOneUserDto,
        ipLocation: getIpRequest(req),
        userAgent,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }

    /** Send information to Job */
    const queue = 'user-new-contributor-create';
    const connect = await amqplib.connect(
      configurations.implementations.amqp.link,
    );
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    await authNewUserCreateJob({ channel, queue });

    return reply({ res, results: result });
  }

  @Put(`/update/:user_uuid`)
  async updateOneUser(
    @Response() res: any,
    @Body() updateInfoUserDto: UpdateInfoUserDto,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const [errors, results] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option4: { user_uuid } },
        { ...updateInfoUserDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/update-organization-to-user`)
  @UseGuards(JwtAuthGuard)
  async updateOneOrganization(
    @Res() res,
    @Req() req,
    @Query('organizationId', ParseIntPipe) organizationId: number,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.updateOrganizationToUser.updateOrganization({
        organizationId,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  /** Change email account*/
  @Put(`/update-email`)
  @UseGuards(JwtAuthGuard)
  async updateEmailUser(
    @Res() res,
    @Req() req,
    @Body() updateEmailUserDto: UpdateEmailUserDto,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.updateInformationToUser.updateEmailToUser({
        ...updateEmailUserDto,
        user,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  /** Change password account*/
  @Put(`/update-password`)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Res() res,
    @Req() req,
    @Body() updateChangePasswordUserDto: UpdateChangePasswordUserDto,
  ) {
    const { user } = req;
    const userId = user?.id;
    const [errors, results] = await useCatch(
      this.changePasswordUser.execute({
        ...updateChangePasswordUserDto,
        userId,
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  /** Update profile account*/
  @Put(`/update-profile/:profileId`)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateProfileDto: CreateOrUpdateProfileDto,
    @Param('profileId', ParseIntPipe) profileId: number,
  ) {
    const [errors, result] = await useCatch(
      this.createOrUpdateProfileService.updateOne(
        { option1: { profileId } },
        { ...createOrUpdateProfileDto },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }

  /** Update profile account*/
  @Put(`/deactivate-user/:user_uuid`)
  @UseGuards(JwtAuthGuard)
  async deactivateProfile(
    @Res() res,
    @Req() req,
    @Body('confirm', ParseBoolPipe) confirm: boolean,
    @Param('user_uuid', ParseUUIDPipe) user_uuid: string,
  ) {
    const { user } = req;
    const [errors, result] = await useCatch(
      this.createOrUpdateUserService.updateOne(
        { option4: { user_uuid } },
        {
          deletedAt: new Date(),
          email: `${generateLongUUID(8)}-${user?.email}`,
        },
      ),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results: result });
  }
}
