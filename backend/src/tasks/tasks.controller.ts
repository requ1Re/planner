import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { type Request } from 'express';
import { type CreateTaskDto } from './dto/create-task.dto';
import { type UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.tasksService.findAll(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(request, projectId, createTaskDto);
  }

  @Get(':id')
  findOne(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('projectId') projectId: string, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
