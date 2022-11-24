import { Injectable, NotFoundException } from '@nestjs/common';
import { Contributor } from '../../../../models/Contributor';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import { DeleteContributorSelections } from '../../types/index';
import {
  CreateContributorOptions,
  UpdateContributorOptions,
  UpdateContributorSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateContributorService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  /** Create one contributor to the database. */
  async createOne(options: CreateContributorOptions): Promise<Contributor> {
    const {
      contributeType,
      contributeId,
      organizationId,
      userCreatedId,
      roleId,
      userId,
    } = {
      ...options,
    };

    const contributor = new Contributor();
    contributor.uuid = generateUUID();
    contributor.contributeType = contributeType;
    contributor.contributeId = contributeId;
    contributor.organizationId = organizationId;
    contributor.userCreatedId = userCreatedId;
    contributor.roleId = roleId;
    contributor.userId = userId;

    const query = this.driver.save(contributor);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one contributor to the database. */
  async updateOne(
    selections: UpdateContributorSelections,
    options: UpdateContributorOptions,
  ): Promise<Contributor> {
    const { option1, option2 } = { ...selections };
    const { roleId, deletedAt } = { ...options };

    let findQuery = this.driver.createQueryBuilder('contributor');

    if (option2) {
      const { contributor_uuid } = { ...option2 };
      findQuery = findQuery.where('contributor.uuid = :uuid', {
        uuid: contributor_uuid,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.roleId = roleId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Update one contributor to the database. */
  async deleteOne(selections: DeleteContributorSelections): Promise<any> {
    const { option1 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('contributor')
      .delete()
      .from(Contributor);

    if (option1) {
      const { contributor_uuid } = { ...option1 };
      query = query.where('uuid = :uuid', { uuid: contributor_uuid });
    }

    const [errorUp, result] = await useCatch(query.execute());
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
