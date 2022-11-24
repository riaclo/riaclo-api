import {
  Controller,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  Res,
  Query,
  Req,
  ParseIntPipe,
  Post,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { reply } from '../../../infrastructure/utils/reply';
import { useCatch } from '../../../infrastructure/utils/use-catch';
import { JwtAuthGuard } from '../../user/middleware';
import { CreateOneContributorToContributor } from '../services/use-cases/create-one-contributor-to-contributor';
import { CreateOrUpdateContributorService } from '../services/mutations/create-or-update-contributor.service';
import { UpdateOnRoleContributorDto } from '../dto/validation-contributor.dto';

@Controller('contributors')
export class CreateOrUpdateOneContributorController {
  constructor(
    private readonly createOrUpdateContributorService: CreateOrUpdateContributorService,
    private readonly createOneContributorToContributor: CreateOneContributorToContributor,
  ) {}

  @Post(`/contributor-create`)
  @UseGuards(JwtAuthGuard)
  async createOneContributor(
    @Res() res,
    @Req() req,
    @Query('contributorId', ParseIntPipe) contributorId: number,
  ) {
    const { user } = req;
    const [error, result] = await useCatch(
      this.createOneContributorToContributor.execute({
        type: 'ORGANIZATION',
        userId: user?.id,
        organizationId: user?.organizationInUtilizationId,
        contributorId,
      }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Delete(`/delete/:contributor_uuid`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContributor(
    @Res() res,
    @Param('contributor_uuid', ParseUUIDPipe) contributor_uuid: string,
  ) {
    const [error, result] = await useCatch(
      this.createOrUpdateContributorService.updateOne(
        { option2: { contributor_uuid } },
        { deletedAt: new Date() },
      ),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Put(`/contributor-update`)
  @UseGuards(JwtAuthGuard)
  async updateOneRoleContributor(
    @Res() res,
    @Body() updateOnRoleContributorDto: UpdateOnRoleContributorDto,
  ) {
    const { contributorId, roleId, contributor_uuid } =
      updateOnRoleContributorDto;
    const [error, result] = await useCatch(
      this.createOrUpdateContributorService.updateOne(
        { option2: { contributor_uuid } },
        { roleId },
      ),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }
}
