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
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dto/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    @Post("/signup")
    async createUser(@Body() body: CreateUserDTO) {
        return await this.authService.signup(body.email, body.password);
    }

    @Post("/signin")
    async signinUser(@Body() body: CreateUserDTO) {
        return await this.authService.signin(body.email, body.password);
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
