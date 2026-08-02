import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { BasicUser } from '../auth/jwt.strategy';
import { type CreateTagDto } from './dto/create-tag.dto';
import { type UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Req() request: Request, @Body() createTagDto: CreateTagDto) {
    const basicUser = request.user as BasicUser;

    return this.tagsService.create(basicUser, createTagDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const basicUser = request.user as BasicUser;
    return this.tagsService.findAll(basicUser);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    const basicUser = request.user as BasicUser;
    return this.tagsService.findOne(basicUser, id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const basicUser = request.user as BasicUser;
    return this.tagsService.update(basicUser, id, updateTagDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    const basicUser = request.user as BasicUser;
    return this.tagsService.remove(basicUser, id);
  }
}
