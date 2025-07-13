import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @AfterInsert()
    logInsert() {
        console.log(`Inserted Report with id: ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated Report with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Removed Report with id: ${this.id}`);
    }
}
