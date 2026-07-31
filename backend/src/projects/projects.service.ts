import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BasicUser } from '../auth/jwt.strategy';
import { Project } from '../generated/prisma/client';
import type {
    ProjectUncheckedCreateInput,
    ProjectUncheckedUpdateInput,
} from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: ProjectUncheckedCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data: createProjectDto,
    });
  }

  findAll(req: Request): Promise<Project[]> {
    const basicUser = req.user as BasicUser;

    return this.prisma.project.findMany({
      where: {
        ownerId: basicUser.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findOne(req: Request, id: string): Promise<Project | null> {
    const basicUser = req.user as BasicUser;

    return this.prisma.project.findUnique({
      where: {
        id,
        ownerId: basicUser.userId
      },
      include: {
        tasks: true
      }
    });
  }

  update(
    id: string,
    updateProjectDto: ProjectUncheckedUpdateInput,
  ): Promise<Project> {
    return this.prisma.project.update({
      data: updateProjectDto,
      where: {
        id,
      },
    });
  }

  remove(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
