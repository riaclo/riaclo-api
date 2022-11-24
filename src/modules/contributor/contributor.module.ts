import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { FindOneContributorByService } from './services/query/find-one-contributor-by.service';

import { FindContributorService } from './services/query/find-contributor.service';
import { CreateOrUpdateContributorService } from './services/mutations/create-or-update-contributor.service';
import { FindOneApplicationTokenByService } from '../application-token/services/query/find-one-application-token-by.service';
import { ApplicationToken } from '../../models/ApplicationToken';
import { FindOneUserByService } from '../user/services/query/find-one-user-by.service';
import { User } from '../../models/User';
import { HttpModule } from '@nestjs/axios';
import {
  GetOneOrMultipleContributorController,
  CreateOrUpdateOneContributorController,
} from './controllers';
import {
  GetAuthorizationToContributor,
  CreateOneContributorToContributor,
} from './services/use-cases';
import { Organization } from '../../models/Organization';
import { FindOneOrganizationByService } from '../organization/services/query/find-one-organization-by.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      Contributor,
      Organization,
      ApplicationToken,
    ]),
  ],
  controllers: [
    GetOneOrMultipleContributorController,
    CreateOrUpdateOneContributorController,
  ],
  providers: [
    FindContributorService,
    FindOneContributorByService,
    CreateOrUpdateContributorService,

    /** Integrate user token middleware */
    FindOneUserByService,
    FindOneOrganizationByService,
    FindOneApplicationTokenByService,

    /** Use case */
    GetAuthorizationToContributor,
    CreateOneContributorToContributor,
  ],
})
export class contributorModule {}
