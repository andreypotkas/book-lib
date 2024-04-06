import { Exclude } from 'class-transformer';
import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @OneToMany(() => Book, (book) => book.userId)
  books: Book[];
}
