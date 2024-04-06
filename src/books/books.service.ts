import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
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
