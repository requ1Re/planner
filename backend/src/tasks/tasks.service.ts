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
        description: createTaskDto.description,
        projectId,
        createdById: basicUser.userId,
        tags: {
          connect: (createTaskDto.tagIds ?? []).map((id) => ({
            id,
          })),
        },
      },
      include: {
        tags: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  findAll(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },

      include: {
        tags: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },

      include: {
        tags: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    console.log('update ' + id + JSON.stringify(updateTaskDto));
    return this.prisma.task.update({
      data: {
        name: updateTaskDto.name,
        description: updateTaskDto.description,
        tags: {
          set: (updateTaskDto.tagIds ?? []).map((id) => ({
            id,
          })),
        },
      },

      where: {
        id,
      },
      include: {
        tags: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
