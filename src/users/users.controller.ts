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
    Session,
    UseInterceptors,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dto/user.dto";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { CurrentUser } from "./decorators/current-users.decorator";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { SessionData } from "express-session";

@Controller("auth")
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    // @Get("/whoami")
    /* whoAmI(@Session() session: SessionData) {
        if (!session?.userId) {
            throw new UnauthorizedException("User not authenticated");
        }

        return this.usersService.findOne(session.userId);
    } */

    @Get("/whoami")
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post("/signup")
    async createUser(
        @Body() body: CreateUserDTO,
        @Session() session: SessionData,
    ) {
        const user = await this.authService.signup(body.email, body.password);

        session.userId = user?.id;

        return user;
    }

    @Post("/signin")
    async signinUser(
        @Body() body: CreateUserDTO,
        @Session() session: SessionData,
    ) {
        const user = await this.authService.signin(body.email, body.password);

        session.userId = user?.id;

        return user;
    }

    @Post("/signout")
    async signoutUser(@Session() session: SessionData) {
        if (!session?.userId) {
            return `No current active session`;
        }

        const activeUser = await this.usersService.findOne(session.userId);

        session.userId = null;

        return `User ${activeUser?.email} signout`;
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
