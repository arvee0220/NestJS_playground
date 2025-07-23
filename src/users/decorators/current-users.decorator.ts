import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { User } from "../user.entity";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext): User | undefined => {
        const request = context.switchToHttp().getRequest<Request>();

        return request.currentUser;
    },
);
