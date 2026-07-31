import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import {
    type ProjectUncheckedCreateInput,
    type ProjectUncheckedUpdateInput,
} from '../generated/prisma/models';
import { ErrorCodes } from '../interceptors/error.interceptor';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: ProjectUncheckedCreateInput) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project)
      throw new NotFoundException(ErrorCodes.ERROR_PROJECT_NOT_FOUND);

    return project;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: ProjectUncheckedUpdateInput,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
