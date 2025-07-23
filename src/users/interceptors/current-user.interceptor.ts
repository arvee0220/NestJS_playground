import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest<Request>();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.usersService.findOne(userId);

            if (user) {
                request.currentUser = user;
            }
        }

        return handler.handle();
    }
}
