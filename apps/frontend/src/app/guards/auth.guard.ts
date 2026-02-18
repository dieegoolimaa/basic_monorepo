import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Protege rotas que exigem login
 * Redireciona para /login se não autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Salva a URL tentada para redirecionar depois do login
    localStorage.setItem('redirectUrl', state.url);
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};

/**
 * AdminGuard - Protege rotas administrativas
 * Requer login + role 'admin'
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }

    const user = authService.currentUser();
    if (user?.role === 'admin') {
        return true;
    }

    // Se logado mas não é admin, redireciona para home
    router.navigate(['/']);
    return false;
};

/**
 * GuestGuard - Impede usuários logados de acessar login/registro
 * Redireciona para /formacoes se já autenticado
 */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        router.navigate(['/formacoes']);
        return false;
    }

    return true;
};
