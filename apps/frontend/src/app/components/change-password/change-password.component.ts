import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzCardModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzMessageModule
    ],
    template: `
    <div class="change-password-container">
        <div class="change-password-card">
            <div class="card-header">
                <span class="lock-icon">🔐</span>
                <h1>Redefinir Senha</h1>
                <p>Por segurança, defina uma nova senha para acessar o painel administrativo.</p>
            </div>

            <div class="card-body">
                <div class="form-group">
                    <label>Nova Senha *</label>
                    <nz-input-group [nzSuffix]="suffixTemplate1">
                        <input [type]="showPassword ? 'text' : 'password'" 
                               nz-input 
                               [(ngModel)]="newPassword" 
                               placeholder="Mínimo 6 caracteres"
                               nzSize="large" />
                    </nz-input-group>
                    <ng-template #suffixTemplate1>
                        <span nz-icon 
                              [nzType]="showPassword ? 'eye-invisible' : 'eye'" 
                              (click)="showPassword = !showPassword"
                              class="toggle-password"></span>
                    </ng-template>
                </div>

                <div class="form-group">
                    <label>Confirmar Nova Senha *</label>
                    <nz-input-group [nzSuffix]="suffixTemplate2">
                        <input [type]="showConfirmPassword ? 'text' : 'password'" 
                               nz-input 
                               [(ngModel)]="confirmPassword" 
                               placeholder="Digite novamente"
                               nzSize="large" />
                    </nz-input-group>
                    <ng-template #suffixTemplate2>
                        <span nz-icon 
                              [nzType]="showConfirmPassword ? 'eye-invisible' : 'eye'" 
                              (click)="showConfirmPassword = !showConfirmPassword"
                              class="toggle-password"></span>
                    </ng-template>
                </div>

                <div class="password-requirements">
                    <p [class.valid]="newPassword.length >= 6">
                        <span nz-icon [nzType]="newPassword.length >= 6 ? 'check-circle' : 'close-circle'"></span>
                        Mínimo 6 caracteres
                    </p>
                    <p [class.valid]="newPassword && newPassword === confirmPassword">
                        <span nz-icon [nzType]="newPassword && newPassword === confirmPassword ? 'check-circle' : 'close-circle'"></span>
                        Senhas coincidem
                    </p>
                </div>

                <button nz-button nzType="primary" nzBlock nzSize="large"
                        [disabled]="!isValid || isLoading"
                        [nzLoading]="isLoading"
                        (click)="changePassword()">
                    <span nz-icon nzType="safety-certificate"></span>
                    Definir Nova Senha
                </button>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .change-password-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f6f8 0%, #e8e5e5 100%);
            padding: 20px;
        }

        .change-password-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            max-width: 440px;
            width: 100%;
            overflow: hidden;
        }

        .card-header {
            background: linear-gradient(135deg, #232222 0%, #444444 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }

        .lock-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
        }

        .card-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
        }

        .card-header p {
            margin: 12px 0 0;
            opacity: 0.9;
            font-size: 14px;
            line-height: 1.5;
        }

        .card-body {
            padding: 32px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
        }

        .toggle-password {
            cursor: pointer;
            color: #9ca3af;
            transition: color 0.2s;
        }

        .toggle-password:hover {
            color: #374151;
        }

        .password-requirements {
            background: #f9fafb;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .password-requirements p {
            margin: 0 0 8px;
            font-size: 13px;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .password-requirements p:last-child {
            margin-bottom: 0;
        }

        .password-requirements p.valid {
            color: #10b981;
        }

        button[nz-button] {
            height: 48px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 12px;
        }
    `]
})
export class ChangePasswordComponent {
    private router = inject(Router);
    private message = inject(NzMessageService);
    private userService = inject(UserService);
    private authService = inject(AuthService);

    newPassword = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
    isLoading = false;

    get isValid(): boolean {
        return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
    }

    changePassword() {
        if (!this.isValid) return;

        this.isLoading = true;
        this.userService.changePassword(this.newPassword).subscribe({
            next: () => {
                // Update the user to clear mustChangePassword flag
                const currentUser = this.authService.currentUser();
                if (currentUser) {
                    currentUser.mustChangePassword = false;
                    this.authService.updateCurrentUser(currentUser);
                }

                this.message.success('Senha alterada com sucesso! Faça login com sua nova senha.');
                this.authService.logout();
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err.error?.message || 'Erro ao alterar senha');
            }
        });
    }
}
