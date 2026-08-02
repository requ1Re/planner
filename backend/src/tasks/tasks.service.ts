import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BasicUser } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(req: Request, projectId: string, createTaskDto: CreateTaskDto) {
    const basicUser = req.user as BasicUser;

    return this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        projectId,
        createdById: basicUser.userId,
      },
    });
  }

  findAll(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.project.update({
      data: updateTaskDto,
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
