import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 255, unique: true})
  name: string;
  @Column({type: 'text'})
  description: string;

  @Column({type: 'int'})
  price: number;

  @Column({type: 'int'})
  stock: number;

  @Column({type: 'varchar'})
  image: string;

  @ManyToMany(()=>Category, (category)=>category.products)
  categories: Category[];
}
