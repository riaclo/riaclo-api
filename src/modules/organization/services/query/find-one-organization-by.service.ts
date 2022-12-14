import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Organization } from '../../../../models/Organization';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneOrganizationSelections } from '../../types';

@Injectable()
export class FindOneOrganizationByService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  async findOneBy(selections: GetOneOrganizationSelections): Promise<any> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('organization')
      .select('organization.name', 'name')
      .addSelect('organization.id', 'id')
      .addSelect('organization.uuid', 'uuid')
      .addSelect('organization.color', 'color')
      .addSelect('organization.userId', 'userId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."contributeId" = "organization"."id"
      AND "con"."contributeType" IN ('ORGANIZATION'))
      AND "con"."deletedAt" IS NULL
      GROUP BY "con"."contributeId", "organization"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
          SELECT jsonb_build_object(
          'uuid', "uad"."uuid",
          'company', "uad"."company",
          'city', "uad"."city",
          'phone', "uad"."phone",
          'region', "uad"."region",
          'street1', "uad"."street1",
          'street2', "uad"."street2",
          'country', "co"."name",
          'cap', "uad"."cap"
          )
          FROM "user_address" "uad"
          LEFT JOIN "country" "co" ON "uad"."countryId" = "co"."id"
          WHERE "uad"."organizationId" = "organization"."id"
          AND "uad"."userId" = "organization"."userId"
          AND "uad"."deletedAt" IS NULL
          ) AS "userAddress"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'userId', "user"."id",
              'user_uuid', "user"."uuid",
              'email', "user"."email",
              'profileId', "user"."profileId",
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'color', "profile"."color",
              'image', "profile"."image"
          ) AS "profileOwner"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'total', CAST(SUM("amu"."amountUsage") AS DECIMAL),
        'currentMonth', DATE_TRUNC('month', "amu"."createdAt")
        )
        FROM "amount_usage" "amu"
        INNER JOIN "amount" "am" ON "amu"."amountId" = "am"."id"
        WHERE "amu"."organizationId" = "am"."organizationId"
        AND "amu"."userId" = "am"."userId"
        AND "organization"."id" = "amu"."organizationId"
        AND "organization"."id" = "am"."organizationId"
        AND DATE_TRUNC('month', "amu"."createdAt") = DATE_TRUNC('month', NOW())
        GROUP BY "amu"."organizationId", "amu"."userId", "am"."userId",
        "organization"."id", DATE_TRUNC('month', "amu"."createdAt")
        ) AS "billing"`,
      )
      .addSelect(
        /*sql*/ `(
        SELECT jsonb_build_object(
        'total', CAST(SUM("amb"."amountBalance") AS DECIMAL)
        )
        FROM "amount_balance" "amb"
        INNER JOIN "amount" "am" ON "amb"."amountId" = "am"."id"
        WHERE "amb"."organizationId" = "am"."organizationId"
        AND "amb"."userId" = "am"."userId"
        AND "organization"."id" = "amb"."organizationId"
        AND "organization"."id" = "am"."organizationId"
        GROUP BY "amb"."organizationId", "amb"."userId", "am"."userId", "organization"."id"
        ) AS "balance"`,
      )
      .where('organization.deletedAt IS NULL')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (option1) {
      const { organizationId } = { ...option1 };
      query = query.andWhere('organization.id = :id', { id: organizationId });
    }

    if (option2) {
      const { organization_uuid } = { ...option2 };
      query = query.andWhere('organization.uuid = :uuid', {
        uuid: organization_uuid,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
