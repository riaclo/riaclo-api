import { Injectable, NotFoundException } from '@nestjs/common';
import { Contributor } from '../../../../models/Contributor';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetContributorsSelections } from '../../types';

@Injectable()
export class FindContributorService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findAll(
    selections: GetContributorsSelections,
  ): Promise<GetContributorsSelections | any> {
    const { option1, option2, is_paginate, filterQuery, pagination } = {
      ...selections,
    };

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.uuid', 'uuid')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.contributeType', 'contributeType')
      .addSelect('contributor.contributeId', 'contributeId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.roleId', 'roleId')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'email', "userOrganization"."email",
          'userId', "organization"."userId",
          'color', "organization"."color",
          'name', "organization"."name",
          'uuid', "organization"."uuid"
      ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "role"."name"
      ) AS "role"`,
      )
      .addSelect('contributor.createdAt', 'createdAt')
      .where('contributor.deletedAt IS NULL');

    if (option1) {
      const { userId, contributeType } = { ...option1 };
      query = query
        .andWhere('contributor.userId = :userId', { userId })
        .andWhere('contributor.contributeType = :contributeType', {
          contributeType,
        });
    }

    if (option2) {
      const { contributeId, contributeType } = { ...option2 };
      query = query
        .addSelect(
          /*sql*/ `jsonb_build_object(
                'fullName', "profile"."fullName",
                'image', "profile"."image",
                'color', "profile"."color",
                'userId', "user"."id",
                'user_uuid', "user"."uuid",
                'email', "user"."email"
            ) AS "profile"`,
        )
        .andWhere('contributor.contributeId = :contributeId', {
          contributeId,
        })
        .andWhere('contributor.contributeType = :contributeType', {
          contributeType,
        });
    }

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('organization.name ::text ILIKE :search', {
            search: `%${filterQuery?.q}%`,
          })
            .orWhere('profile.fullName ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            })
            .orWhere('user.username ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            })
            .orWhere('user.email ::text ILIKE :search', {
              search: `%${filterQuery?.q}%`,
            });
        }),
      );
    }

    query = query
      .leftJoin('contributor.organization', 'organization')
      .leftJoin('organization.user', 'userOrganization')
      .leftJoin('contributor.user', 'user')
      .leftJoin('contributor.role', 'role')
      .leftJoin('user.profile', 'profile');

    if (is_paginate) {
      const [errorRowCount, rowCount] = await useCatch(query.getCount());
      if (errorRowCount) throw new NotFoundException(errorRowCount);

      const [errors, results] = await useCatch(
        query
          .orderBy('contributor.createdAt', pagination?.sort)
          .limit(pagination.limit)
          .offset((pagination.page - 1) * pagination.limit)
          .getRawMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return withPagination({
        pagination,
        rowCount,
        data: results,
      });
    } else {
      const [errors, results] = await useCatch(
        pagination
          ? query
              .orderBy('contributor.createdAt', pagination?.sort)
              .limit(pagination.limit)
              .getRawMany()
          : query.orderBy('contributor.createdAt', 'DESC').getRawMany(),
      );
      if (errors) throw new NotFoundException(errors);

      return results;
    }
  }
}
