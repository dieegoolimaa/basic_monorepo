import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;
        const userEmail = user?.email || 'anonymous';
        const now = Date.now();

        this.logger.log(
            `➡️  ${method} ${url} - User: ${userEmail} - Body: ${JSON.stringify(body)}`
        );

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const responseTime = Date.now() - now;
                    this.logger.log(
                        `✅ ${method} ${url} - ${responseTime}ms - User: ${userEmail}`
                    );
                },
                error: (error) => {
                    const responseTime = Date.now() - now;
                    this.logger.error(
                        `❌ ${method} ${url} - ${responseTime}ms - User: ${userEmail} - Error: ${error.message}`
                    );
                },
            })
        );
    }
}
