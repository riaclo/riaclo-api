import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { FindOneContributorByService } from '../query/find-one-contributor-by.service';
import { FindOneOrganizationByService } from '../../../organization/services/query/find-one-organization-by.service';
import { contributorRequestDto } from '../../dto/validation-contributor.dto';

@Injectable()
export class GetAuthorizationToContributor {
  constructor(
    private readonly findOneContributorByService: FindOneContributorByService,
    private readonly findOneOrganizationByService: FindOneOrganizationByService,
  ) {}

  /** Get one Authorization to the database. */
  async execute(options: contributorRequestDto): Promise<any> {
    const { userId, organizationId, type } = { ...options };

    if (organizationId) {
      const [__errorOr, organization] = await useCatch(
        this.findOneOrganizationByService.findOneBy({
          option1: { organizationId },
        }),
      );
      if (__errorOr) {
        throw new NotFoundException(__errorOr);
      }

      const [__errorSub, contributorOrganization] = await useCatch(
        this.findOneContributorByService.findOneBy({
          option1: {
            userId,
            organizationId,
            contributeType: type,
            contributeId: organization.id,
          },
        }),
      );
      if (__errorSub) {
        throw new NotFoundException(__errorSub);
      }
      return { organization, contributorOrganization };
    }

    return null;
  }
}
