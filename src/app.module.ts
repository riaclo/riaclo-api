import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AppDataSource,
  AppSeedDataSource,
} from './infrastructure/databases/config';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './modules/contact/contact.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';
import { ApplicationTokenModule } from './modules/application-token/application-token.module';
import { ApplicationModule } from './modules/application/application.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AmountModule } from './modules/amount/amount.module';
import { AmountUsageModule } from './modules/amount-usage/amount-usage.module';
import { BillingModule } from './modules/billing/billing.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AmountBalanceModule } from './modules/amount-balance/amount-balance.module';
import { CountryModule } from './modules/country/country.module';
import { FaqModule } from './modules/faq/faq.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { contributorModule } from './modules/contributor/contributor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
    ScheduleModule.forRoot(),
    ContactModule,
    ProfileModule,
    CurrencyModule,
    UserModule,
    QrCodeModule,
    ApplicationTokenModule,
    UserAddressModule,
    ApplicationModule,
    TestimonialModule,
    OrganizationModule,
    AmountModule,
    FaqModule,
    BillingModule,
    ActivityModule,
    AmountUsageModule,
    CountryModule,
    contributorModule,
    AmountBalanceModule,
  ],
})
export class AppModule {}
