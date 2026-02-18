import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const message = inject(NzMessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocorreu um erro inesperado';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Erro: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'Servidor indisponível. Verifique sua conexão.';
                        break;
                    case 400:
                        errorMessage = error.error?.message || 'Dados inválidos';
                        break;
                    case 401:
                        errorMessage = 'Sessão expirada. Faça login novamente.';
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('current_user');
                        router.navigate(['/login']);
                        break;
                    case 403:
                        errorMessage = 'Acesso negado';
                        break;
                    case 404:
                        errorMessage = error.error?.message || 'Recurso não encontrado';
                        break;
                    case 409:
                        errorMessage = error.error?.message || 'Conflito de dados';
                        break;
                    case 500:
                        errorMessage = 'Erro interno do servidor';
                        break;
                    default:
                        errorMessage = error.error?.message || errorMessage;
                }
            }

            message.error(errorMessage);
            return throwError(() => error);
        })
    );
};
