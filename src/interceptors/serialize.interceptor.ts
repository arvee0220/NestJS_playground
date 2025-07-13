import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class SerializeInterceptor<T> implements NestInterceptor<unknown, T> {
    intercept(
        context: ExecutionContext,
        handler: CallHandler<T>,
    ): Observable<T> {
        // Run something before a request is handled by the request handler
        console.log("Running before the handler: ", context);

        return handler.handle().pipe(
            map((data: T) => {
                // Run something before the response is sent out
                console.log("Running before response is sent out:", data);

                return data;
            }),
        );
    }
}
