import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { FilterOptions, PaginationOptions } from './interfaces/query.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(
    paginationOptions: PaginationOptions,
    filterOptions: FilterOptions,
  ): Promise<{ books: Book[]; total: number }> {
    const { page = 1, limit = 10 } = paginationOptions;

    const findOptions: any = {
      take: limit,
      skip: (page - 1) * limit,
    };

    if (filterOptions.author) {
      findOptions.where = { author: filterOptions.author };
    }

    if (filterOptions.yearOfPublication) {
      findOptions.where = {
        ...findOptions.where,
        yearOfPublication: filterOptions.yearOfPublication,
      };
    }

    const [books, total] = await this.bookRepository.findAndCount(findOptions);

    return { books, total };
  }
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    const book = this.bookRepository.create(bookData);
    return await this.bookRepository.save(book);
  }

  async update(id: number, bookData: Partial<Book>): Promise<Book> {
    const book = await this.findOne(id);
    return await this.bookRepository.save({ ...book, ...bookData });
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
