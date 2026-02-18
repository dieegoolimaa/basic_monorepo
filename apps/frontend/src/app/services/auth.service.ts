import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, InviteCode } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    currentUser = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('auth_token');

        if (storedUser && token) {
            try {
                this.currentUser.set(JSON.parse(storedUser));
            } catch {
                this.clearSession();
            }
        }
    }

    /**
     * LOGIN - Integrado com backend
     */
    login(credentials: { email: string, password: string }): Observable<{ token: string, user: User }> {
        return this.http.post<{ token: string, user: User }>(
            `${this.apiUrl}/auth/login`,
            credentials
        ).pipe(
            tap(response => {
                this.saveSession(response);
            }),
            catchError(error => {
                const message = error.error?.message || 'Credenciais inválidas';
                return throwError(() => new Error(message));
            })
        );
    }

    private saveSession(response: { token: string, user: User }) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
    }

    private clearSession() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    /**
     * Update current user state (used after password change)
     */
    updateCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
    }

    /**
     * VALIDATE INVITE CODE - Integrado com backend
     */
    validateInviteCode(code: string): Observable<{ valid: boolean, courseIds?: string[] }> {
        return this.http.get<any>(`${this.apiUrl}/auth/validate-invite`, {
            params: { code }
        }).pipe(
            tap(response => {
                // Backend retorna { valid: true, invite: {...} } ou { valid: false }
                if (response.valid && response.invite) {
                    response.courseIds = response.invite.courseIds;
                }
            }),
            catchError(() => {
                return throwError(() => ({ valid: false }));
            })
        );
    }

    /**
     * REGISTER - Integrado com backend
     */
    register(data: {
        name: string,
        email: string,
        phone: string,
        address?: string,
        city?: string,
        password: string,
        inviteCode: string
    }): Observable<{ token: string, user: User }> {
        return this.http.post<{ token: string, user: User }>(
            `${this.apiUrl}/auth/register`,
            data
        ).pipe(
            tap(response => {
                this.saveSession(response);
            }),
            catchError(error => {
                const message = error.error?.message || 'Erro ao registrar usuário';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * LOGOUT
     */
    logout() {
        this.clearSession();
    }

    /**
     * GET TOKEN
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * IS ADMIN
     */
    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    /**
     * CAN ACCESS COURSE
     */
    canAccessCourse(courseId: string): boolean {
        const user = this.currentUser();
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.enrolledCourses?.includes(courseId) ?? false;
    }

    /**
     * REQUEST PASSWORD RESET - Send email with reset link
     */
    requestPasswordReset(email: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.apiUrl}/auth/forgot-password`,
            { email }
        );
    }

    /**
     * RESET PASSWORD - With token from email
     */
    resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.apiUrl}/auth/reset-password`,
            { token, newPassword }
        );
    }
}

