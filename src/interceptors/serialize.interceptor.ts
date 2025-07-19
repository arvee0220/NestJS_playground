import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

type ClassConstructor<T> = {
  new (...args: unknown[]): T;
};

export function Serialize <T>(dto: ClassConstructor<T>) {
    return UseInterceptors(new SerializeInterceptor<unknown, T>(dto));
}

export class SerializeInterceptor<TInput, TOutput> implements NestInterceptor<TInput, TOutput> {

    constructor(private readonly dto: ClassConstructor<TOutput>) {}

    intercept(
        context: ExecutionContext,
        handler: CallHandler<TInput>,
    ): Observable<TOutput> {
        // Run something before a request is handled by the request handler
        console.log("Running before the handler: ", context);

        return handler.handle().pipe(
            map((data: TInput) => {
                // Run something before the response is sent out
                console.log("Running before response is sent out:", data);

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
