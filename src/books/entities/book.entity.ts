import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  yearOfPublication: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.books)
  userId: number;
}
