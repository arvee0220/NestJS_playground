import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(email: string, password: string) {
        if (!password?.trim() || !email.trim()) {
            throw new BadRequestException("Email and password are required.");
        }

        if (password.length < 8) {
            throw new BadRequestException(
                "Password must be at least 8 characters long",
            );
        }

        const existingUser = await this.repo.findOne({ where: { email } });

        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        const user = this.repo.create({ email, password });

        console.log(user);

        await this.repo.save(user);

        const showUser = await this.repo.findOne({
            where: { id: user.id },
            select: ["id", "email"],
        });

        return showUser;
    }

    async findOne(id: number) {
        const user = await this.repo.findOne({
            where: { id },
            select: ["id", "email"],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async find(email: string) {
        if (!email) {
            throw new BadRequestException("Email query parameter is required");
        }

        const users = await this.repo.find({
            where: { email },
            select: ["id", "email", "password"],
        });        

        // Returns all users with the email similar to the passed argument
        return users;
    }

    async getAll(prop: string = "id", order: "ASC" | "DESC" = "ASC") {
        const users = await this.repo.find({
            select: ["id", "email"],
            order: {
                [prop]: order,
            },
        });

        console.log(`Found ${users.length} users`);

        return users;
    }

    async update(id: number, prop: Partial<User>) {
        const existingUser = await this.findOne(id);

        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        await this.repo.update(id, prop);

        const updatedUser = await this.findOne(id);

        return updatedUser;
    }

    async remove(id: number) {
        const user = await this.repo.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        await this.repo.remove(user);

        return { email: user.email, message: "User deleted successfully" };
    }
}
