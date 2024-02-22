import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity()
export class ScrapRequest {
  @PrimaryColumn()
  handle!: string;

  @Column({ default: Date.now })
  started_at!: Date;

  @Column({ nullable: true })
  result!: string | null;
}
