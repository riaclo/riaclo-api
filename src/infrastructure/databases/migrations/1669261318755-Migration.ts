import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1669261318755 implements MigrationInterface {
  name = 'Migration1669261318755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "activityAbleType" character varying, "activityAbleId" bigint, "action" character varying(30), "ipLocation" character varying, "browser" character varying, "country" character varying, "platform" character varying, "color" character varying, "city" character varying, "countryCode" character varying, "organizationId" bigint, "applicationId" bigint, "userCreatedId" bigint, "usage" bigint, "view" bigint, CONSTRAINT "UQ_d848e62c1a30e6fd2091b935c43" UNIQUE ("uuid"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amount" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amount" double precision, "currency" character varying, "type" character varying, "paymentMethod" character varying, "token" character varying, "invoiceNumber" character varying, "urlPdf" character varying, "urlXml" character varying, "description" character varying, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, CONSTRAINT "PK_a477ff5de83a86ac715bb5ddac9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "name" character varying, "status" boolean NOT NULL DEFAULT true, "code" character varying, "symbol" character varying, "amount" double precision, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "currencyId" bigint, "countryId" bigint, "image" character varying, "color" character varying, "url" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "application" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "name" character varying, "color" character varying, "statusOnline" character varying(30) NOT NULL DEFAULT 'ONLINE', "userId" bigint, "userCreatedId" bigint, CONSTRAINT "UQ_71af2cd4dccba665296d4befbfe" UNIQUE ("uuid"), CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_token" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "userId" bigint, "userCreatedId" bigint, "applicationId" bigint, "organizationId" bigint, "token" character varying, CONSTRAINT "UQ_b52a8f306d16385f00594b1edb9" UNIQUE ("uuid"), CONSTRAINT "PK_1e5d54602620099c1e7ccf7ae47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contributor" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "contributeType" character varying, "contributeId" bigint, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, "roleId" bigint, CONSTRAINT "UQ_cfda411a8d7226364dc25e72ce8" UNIQUE ("uuid"), CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "confirmedAt" TIMESTAMP WITH TIME ZONE, "email" character varying, "accessToken" text, "refreshToken" text, "username" character varying, "token" character varying, "password" character varying, "noHashPassword" character varying, "profileId" bigint, "organizationInUtilizationId" bigint, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amount_balance" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amountBalance" double precision, "amountId" bigint, "userId" bigint, "organizationId" bigint, "monthAmountBalanceAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5d5b631a0329b2d4f1c68ff84d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_address" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "company" character varying, "city" character varying, "phone" character varying, "region" character varying, "street1" character varying, "street2" character varying, "cap" character varying, "countryId" bigint, "userId" bigint, "organizationId" bigint, CONSTRAINT "UQ_dadbe54c4732e6f266aacd15ad6" UNIQUE ("uuid"), CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "name" character varying, "requiresPayment" boolean NOT NULL DEFAULT false, "color" character varying, "userId" bigint, CONSTRAINT "UQ_59f940b5775a9ccf5c2f094c8af" UNIQUE ("uuid"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amount_usage" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amountUsage" double precision, "amountId" bigint, "userId" bigint, "organizationId" bigint, CONSTRAINT "REL_689972109e31c6b68377e08660" UNIQUE ("amountId"), CONSTRAINT "PK_0b2147cb425cf3ade9ed5862bd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "isRed" boolean NOT NULL DEFAULT false, "slug" character varying, "ipLocation" character varying, "fullName" character varying, "phone" character varying, "countryId" integer, "email" character varying, "description" text, "organizationId" bigint, "userCreatedId" bigint, CONSTRAINT "UQ_126b452db77c24d32b5885f4468" UNIQUE ("uuid"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "code" character varying NOT NULL DEFAULT false, "name" character varying, CONSTRAINT "UQ_4e06beff3ecfb1a974312fe536d" UNIQUE ("uuid"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faq" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "slug" character varying, "status" boolean NOT NULL DEFAULT true, "title" character varying, "type" character varying, "description" text, "userCreatedId" bigint, "userId" bigint, CONSTRAINT "UQ_48bba3278d848b2f074cacfbb15" UNIQUE ("uuid"), CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "qr_code" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "qrCode" text, "barCode" text, "qrCodType" character varying, "qrCodableId" bigint, CONSTRAINT "PK_21be15bed42505b3cddf438a037" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reset_password" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "email" character varying, "accessToken" character varying, "token" character varying, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "testimonial" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "fullName" character varying, "occupation" character varying, "rete" integer, "image" character varying, "link" character varying, "description" text, "userCreatedId" bigint, "userId" bigint, CONSTRAINT "UQ_5f9dc688fc1167f6fb214e7eb18" UNIQUE ("uuid"), CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_ec56d42527f43b78a5272d431c0" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_token" ADD CONSTRAINT "FK_13c7a1841ed6ca37889ec1e3d99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_token" ADD CONSTRAINT "FK_05ac6b43d94110a9f863998f380" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_7e29d8554a3e38fcc57a997dd47" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed" FOREIGN KEY ("userCreatedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_568303616cf81f5b9c2af180f4f" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7" FOREIGN KEY ("organizationInUtilizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_balance" ADD CONSTRAINT "FK_742c3a03b0322faf1ba49ac4090" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_640e370946e53d3117c038ef36a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" ADD CONSTRAINT "FK_689972109e31c6b68377e08660f" FOREIGN KEY ("amountId") REFERENCES "amount"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" ADD CONSTRAINT "FK_8fafac85a174cca641b5a9b8d94" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "amount_usage" DROP CONSTRAINT "FK_8fafac85a174cca641b5a9b8d94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" DROP CONSTRAINT "FK_689972109e31c6b68377e08660f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_640e370946e53d3117c038ef36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_balance" DROP CONSTRAINT "FK_742c3a03b0322faf1ba49ac4090"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_5334a80199f7cbe3e014c1768c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_568303616cf81f5b9c2af180f4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_7e29d8554a3e38fcc57a997dd47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_token" DROP CONSTRAINT "FK_05ac6b43d94110a9f863998f380"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_token" DROP CONSTRAINT "FK_13c7a1841ed6ca37889ec1e3d99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_ec56d42527f43b78a5272d431c0"`,
    );
    await queryRunner.query(`DROP TABLE "testimonial"`);
    await queryRunner.query(`DROP TABLE "reset_password"`);
    await queryRunner.query(`DROP TABLE "qr_code"`);
    await queryRunner.query(`DROP TABLE "faq"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "contact"`);
    await queryRunner.query(`DROP TABLE "amount_usage"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TABLE "amount_balance"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "contributor"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "application_token"`);
    await queryRunner.query(`DROP TABLE "application"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "currency"`);
    await queryRunner.query(`DROP TABLE "amount"`);
    await queryRunner.query(`DROP TABLE "activity"`);
  }
}
