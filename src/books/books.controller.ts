import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('author') author?: string,
    @Query('year') yearOfPublication?: number,
  ) {
    const paginationOptions = { page, limit };

    const filterOptions = {};
    if (author) {
      filterOptions['author'] = author;
    }
    if (yearOfPublication) {
      filterOptions['yearOfPublication'] = yearOfPublication;
    }

    return this.bookService.findAll(paginationOptions, filterOptions);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBookBody: Omit<CreateBookDto, 'userId'>,
    @Req() req: Request,
  ) {
    const { id } = req['user'];
    return this.bookService.create({ ...createBookBody, userId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
