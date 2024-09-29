import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    // DO SOMETHING e.g
    return next.handle().pipe(
      map((data: any) => {
        // Run something before the respone is sent out
        return plainToClass(UserDto, data, {
          // Indicates if extraneous properties should be excluded from the value when converting a plain value to a class.
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
