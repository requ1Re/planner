import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          return new HttpException(
            {
              message: err.message
            },
            err.status,
          );
        }),
      ),
    );
  }
}

export enum ErrorCodes {
  ERROR_PROJECT_NOT_FOUND = 'ERROR_PROJECT_NOT_FOUND',
  ERROR_TASK_NOT_FOUND = 'ERROR_TASK_NOT_FOUND',
}
