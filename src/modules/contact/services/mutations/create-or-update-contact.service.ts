import { generateLongUUID } from '../../../../infrastructure/utils/commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../../../../models/Contact';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import {
  CreateContactOptions,
  UpdateContactOptions,
  UpdateContactSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateContactService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  /** Create one contact to the database. */
  async createOne(options: CreateContactOptions): Promise<Contact> {
    const {
      email,
      phone,
      fullName,
      description,
      ipLocation,
      organizationId,
      countryId,
    } = {
      ...options,
    };

    const contact = new Contact();
    contact.uuid = generateUUID();
    contact.slug = generateLongUUID(30);
    contact.email = email;
    contact.phone = phone;
    contact.ipLocation = ipLocation;
    contact.description = description;
    contact.countryId = countryId;
    contact.fullName = fullName;

    const query = this.driver.save(contact);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one contact to the database. */
  async updateOne(
    selections: UpdateContactSelections,
    options: UpdateContactOptions,
  ): Promise<Contact> {
    const { option1 } = { ...selections };
    const { email, fullName, description, countryId, isRed, deletedAt } = {
      ...options,
    };

    let findQuery = this.driver.createQueryBuilder('contact');

    if (option1) {
      const { contact_uuid } = { ...option1 };
      findQuery = findQuery.where('contact.uuid = :uuid', {
        uuid: contact_uuid,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.email = email;
    findItem.countryId = countryId;
    findItem.description = description;
    findItem.fullName = fullName;
    findItem.isRed = isRed;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
