import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Res,
  Query,
  Req,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { FindOneContributorByService } from '../services/query/find-one-contributor-by.service';
import { RequestPaginationDto } from '../../../infrastructure/utils/pagination/request-pagination.dto';
import { FilterQueryDto } from '../../../infrastructure/utils/filter-query/filter-query.dto';
import { FindContributorService } from '../services/query/find-contributor.service';

@Controller('contributors')
export class GetOneOrMultipleContributorController {
  constructor(
    private readonly findOneContributorByService: FindOneContributorByService,
    private readonly findContributorService: FindContributorService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const [errors, results] = await useCatch(
      this.findContributorService.findAll({
        is_paginate,
        filterQuery,
        pagination,
        option1: {
          userId: user?.id,
          contributeType: 'ORGANIZATION',
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/contributors`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsByContributor(
    @Res() res,
    @Req() req,
    @Query() pagination: RequestPaginationDto,
    @Query() filterQuery: FilterQueryDto,
    @Query('is_paginate', ParseBoolPipe) is_paginate: boolean,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const [errors, results] = await useCatch(
      this.findContributorService.findAll({
        is_paginate,
        filterQuery,
        pagination,
        option2: {
          contributeId: user?.organizationInUtilizationId,
          contributeType: 'ORGANIZATION',
        },
      }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByIDcontributor(
    @Res() res,
    @Req() req,
    @Query('contributeId', ParseIntPipe) contributeId: number,
  ) {
    const { user } = req;
    const [error, result] = await useCatch(
      this.findOneContributorByService.findOneBy({
        option1: {
          userId: user?.id,
          contributeId: contributeId,
          contributeType: 'ORGANIZATION',
          organizationId: user?.organizationInUtilizationId,
        },
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}
