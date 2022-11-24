import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contributor } from '../../../../models/Contributor';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneContributorSelections } from '../../types';

@Injectable()
export class FindOneContributorByService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findOneBy(
    selections: GetOneContributorSelections,
  ): Promise<Contributor> {
    const { option1, option3 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('contributor')
      .leftJoinAndSelect('contributor.organization', 'organization')
      .where('contributor.deletedAt IS NULL');

    if (option1) {
      const { userId, contributeId, contributeType, organizationId } = {
        ...option1,
      };
      query = query
        .andWhere('contributor.userId = :userId', { userId })
        .andWhere('contributor.contributeType = :contributeType', {
          contributeType,
        })
        .andWhere('contributor.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('contributor.contributeId = :contributeId', {
          contributeId,
        });
    }

    if (option3) {
      const { contributor_uuid } = { ...option3 };
      query = query.andWhere('contributor.uuid = :uuid', {
        uuid: contributor_uuid,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contributor not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
