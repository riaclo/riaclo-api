import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import {
  contributorRequestDto,
  getOneRoleByName,
} from '../../dto/validation-contributor.dto';
import * as amqplib from 'amqplib';
import { GetAuthorizationToContributor } from './get-authorization-to-contributor';
import { CreateOrUpdateContributorService } from '../mutations/create-or-update-contributor.service';
import { FindOneUserByService } from '../../../user/services/query/find-one-user-by.service';
import { configurations } from '../../../../infrastructure/configurations/index';
import { contributorJob } from '../../jobs/contributor-job';

@Injectable()
export class CreateOneContributorToContributor {
  constructor(
    private readonly findOneUserByService: FindOneUserByService,
    private readonly getAuthorizationToContributor: GetAuthorizationToContributor,
    private readonly createOrUpdateContributorService: CreateOrUpdateContributorService,
  ) {}

  /** Get one Authorization to the database. */
  async execute(options: contributorRequestDto): Promise<any> {
    const { userId, organizationId, contributorId, type } = { ...options };

    const [__errorOr, isExistedResult] = await useCatch(
      this.getAuthorizationToContributor.execute({
        organizationId,
        userId: contributorId,
        type,
      }),
    );
    if (__errorOr) {
      throw new NotFoundException(__errorOr);
    }

    // Find if organization exist
    if (!isExistedResult?.contributorOrganization) {
      const [__error, contributor] = await useCatch(
        this.createOrUpdateContributorService.createOne({
          contributeType: type,
          contributeId: isExistedResult?.organization?.id,
          organizationId,
          userCreatedId: userId,
          userId: contributorId,
          roleId: getOneRoleByName('MODERATOR'),
        }),
      );
      if (__error) {
        throw new NotFoundException(__error);
      }
      // Send notification
      const [_errorId, userGuest] = await useCatch(
        this.findOneUserByService.findOneBy({
          option1: { userId },
        }),
      );
      if (_errorId) {
        throw new NotFoundException(_errorId);
      }

      const [_errorIv, userContributor] = await useCatch(
        this.findOneUserByService.findOneBy({
          option1: { userId: contributor?.userId },
        }),
      );
      if (_errorIv) {
        throw new NotFoundException(_errorIv);
      }

      const user = { userGuest, userContributor };
      const queue = 'user-contributor';
      const connect = await amqplib.connect(
        configurations.implementations.amqp.link,
      );
      const channel = await connect.createChannel();
      await channel.assertQueue(queue, { durable: false });
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
      await contributorJob({ channel, queue });
    }

    return isExistedResult;
  }
}
