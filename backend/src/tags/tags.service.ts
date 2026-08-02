import { Injectable } from '@nestjs/common';
import { BasicUser } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create(user: BasicUser, createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        ...createTagDto,
        userId: user.userId,
      },
      omit: {
        userId: true
      }
    });
  }

  findAll(user: BasicUser) {
    return this.prisma.tag.findMany({
      where: {
        userId: user.userId,
      },
      omit: {
        userId: true
      }
    });
  }

  findOne(user: BasicUser, id: string) {
    return this.prisma.tag.findUnique({
      where: {
        id,
        userId: user.userId,
      },
      omit: {
        userId: true
      }
    });
  }

  update(user: BasicUser, id: string, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      data: {
        ...updateTagDto,
      },
      where: {
        id,
        userId: user.userId,
      },
      omit: {
        userId: true
      }
    });
  }

  remove(user: BasicUser, id: string) {
    return this.prisma.tag.delete({
      where: {
        id,
        userId: user.userId,
      },
    });
  }
}
