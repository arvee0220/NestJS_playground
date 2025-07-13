import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { SerializeInterceptor } from "src/interceptors/serialize.interceptor";

@Controller("auth")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post("/signup")
    async createUser(@Body() body: CreateUserDTO) {
        return await this.usersService.create(body.email, body.password);
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getAll();
    }

    @Get("/query")
    async findAllUsers(@Query("email") email: string) {
        const users = await this.usersService.find(email);

        return users;
    }

    @UseInterceptors(SerializeInterceptor)
    @Get("/:id")
    async findUser(@Param("id", ParseIntPipe) id: number) {
        console.log("handler is running");
        
        return await this.usersService.findOne(id);
    }

    @Patch("/:id")
    async updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateUserDTO,
    ) {
        return await this.usersService.update(id, body);
    }

    @Delete("/:id")
    async deleteUser(@Param("id", ParseIntPipe) id: number) {
        return await this.usersService.remove(id);
    }
}
