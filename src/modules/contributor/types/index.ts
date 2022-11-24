import { Contributor } from '../../../models/Contributor';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetContributorsSelections = {
  is_paginate?: boolean;
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
  option1?: {
    userId: Contributor['userId'];
    contributeType: Contributor['contributeType'];
  };
  option2?: {
    contributeId: Contributor['contributeId'];
    contributeType: Contributor['contributeType'];
  };
};

export type GetOneContributorSelections = {
  option1?: {
    userId: Contributor['userId'];
    contributeId: Contributor['contributeId'];
    contributeType: Contributor['contributeType'];
    organizationId: Contributor['organizationId'];
  };
  option2?: {
    contributorId: Contributor['id'];
  };
  option3?: {
    contributor_uuid: Contributor['uuid'];
  };
};

export type UpdateContributorSelections = {
  option1?: {
    contributorId: Contributor['id'];
  };
  option2?: {
    contributor_uuid: Contributor['uuid'];
  };
};

export type DeleteContributorSelections = {
  option1?: {
    contributor_uuid: Contributor['uuid'];
  };
};

export type CreateContributorOptions = Partial<Contributor>;

export type UpdateContributorOptions = Partial<Contributor>;
