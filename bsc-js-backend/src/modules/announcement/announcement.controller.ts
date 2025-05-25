import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }

  @Get('recent')
  getRecentAnnouncements(@Query('limit', ParseIntPipe) limit: number = 5) {
    return this.announcementService.getRecentAnnouncements(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.remove(id);
  }
}
