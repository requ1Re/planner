import { Injectable } from '@nestjs/common';
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

  findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findOne(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
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
