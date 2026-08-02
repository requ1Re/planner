import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { ErrorCodes } from '../interceptors/error.interceptor';
import { type CreateProjectDto, type UpdateProjectDto } from './create-update-project-dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() request: Request, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(request, createProjectDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.projectsService.findAll(request);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const project = await this.projectsService.findOne(request, id);
    if (!project) {
      throw new NotFoundException(ErrorCodes.ERROR_PROJECT_NOT_FOUND);
    }

    return project;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
