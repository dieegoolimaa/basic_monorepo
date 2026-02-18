import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzInputModule,
        NzFormModule,
        NzIconModule,
        NzMessageModule
    ],
    template: `
    <div class="reset-wrapper">
        <div class="reset-card fade-in">
            <!-- Invalid Token State -->
            <ng-container *ngIf="!token">
                <div class="error-state">
                    <div class="error-icon">
                        <span nz-icon nzType="warning" nzTheme="outline"></span>
                    </div>
                    <h2>Link Inválido</h2>
                    <p>O link de redefinição de senha é inválido ou já expirou por segurança.</p>
                    <a routerLink="/esqueci-senha" nz-button nzType="primary" nzSize="large" class="btn-action">
                        SOLICITAR NOVO LINK
                    </a>
                </div>
            </ng-container>

            <!-- Reset Form -->
            <ng-container *ngIf="token && !success">
                <div class="brand-header">
                    <div class="logo">basic.</div>
                    <p class="subtitle">Nova Senha de Acesso</p>
                </div>

                <form (ngSubmit)="submitReset()" class="reset-form">
                    <nz-form-item>
                        <nz-form-control>
                            <nz-input-group [nzPrefix]="prefixLock" [nzSuffix]="suffixEye1">
                                <input nz-input [type]="showPassword ? 'text' : 'password'" 
                                       placeholder="Nova Senha" [(ngModel)]="newPassword" name="newPassword" 
                                       required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixLock>
                                <span nz-icon nzType="lock" class="input-icon"></span>
                            </ng-template>
                            <ng-template #suffixEye1>
                                <span nz-icon [nzType]="showPassword ? 'eye-invisible' : 'eye'" 
                                      class="toggle-eye" (click)="showPassword = !showPassword"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

                    <nz-form-item>
                        <nz-form-control>
                            <nz-input-group [nzPrefix]="prefixLock2" [nzSuffix]="suffixEye2">
                                <input nz-input [type]="showConfirmPassword ? 'text' : 'password'" 
                                       placeholder="Confirmar Senha" [(ngModel)]="confirmPassword" 
                                       name="confirmPassword" required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixLock2>
                                <span nz-icon nzType="check-square" class="input-icon"></span>
                            </ng-template>
                            <ng-template #suffixEye2>
                                <span nz-icon [nzType]="showConfirmPassword ? 'eye-invisible' : 'eye'" 
                                      class="toggle-eye" (click)="showConfirmPassword = !showConfirmPassword"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

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
                            [disabled]="!isValid" [nzLoading]="isLoading" class="btn-submit">
                        REDEFINIR SENHA
                    </button>
                </form>
            </ng-container>

            <!-- Success State -->
            <ng-container *ngIf="success">
                <div class="success-state">
                    <div class="success-icon">
                        <span nz-icon nzType="check-circle" nzTheme="outline"></span>
                    </div>
                    <h2>Tudo pronto!</h2>
                    <p>Sua senha foi redefinida com sucesso. Use sua nova credencial para acessar a plataforma.</p>
                    <a routerLink="/login" nz-button nzType="primary" nzSize="large" class="btn-action">
                        FAZER LOGIN
                    </a>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styles: [`
        .reset-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--background-color);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(229, 213, 176, 0.03) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(229, 213, 176, 0.03) 0%, transparent 40%);
            padding: 20px;
            z-index: 2000;
        }

        .reset-card {
            width: 100%;
            max-width: 440px;
            background: #080808;
            border: 1px solid var(--border-color);
            padding: 5rem 4rem;
            text-align: center;
            box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .brand-header {
            margin-bottom: 3rem;
            .logo { 
                font-family: var(--font-serif);
                font-size: 3rem; 
                color: #fff;
                margin-bottom: 1.5rem;
                display: block;
                letter-spacing: -0.02em;

                &::after {
                    content: '.';
                    color: var(--primary-color);
                }
            }
            .subtitle { 
                color: var(--primary-color); 
                font-size: 0.65rem; 
                letter-spacing: 0.4em;
                text-transform: uppercase;
                opacity: 0.6;
            }
        }

        .reset-form {
            text-align: left;

            nz-form-item { margin-bottom: 2rem; }

            ::ng-deep {
                .ant-input-affix-wrapper {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid var(--border-color) !important;
                    border-radius: 0 !important;
                    padding: 12px 0 !important;
                    box-shadow: none !important;
                    transition: var(--transition-lux);
                    
                    &:hover, &.ant-input-affix-wrapper-focused { 
                        border-bottom-color: var(--primary-color) !important; 
                    }
                    
                    input {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: #fff !important;
                        font-size: 1rem !important;
                        height: auto !important;
                        padding: 0 !important;
                        
                        &::placeholder { color: rgba(255,255,255,0.2) !important; }

                        /* Fix for autofill blue background */
                        &:-webkit-autofill,
                        &:-webkit-autofill:hover,
                        &:-webkit-autofill:focus,
                        &:-webkit-autofill:active {
                            -webkit-text-fill-color: #fff !important;
                            -webkit-box-shadow: 0 0 0px 1000px #080808 inset !important;
                            transition: background-color 5000s ease-in-out 0s;
                        }
                    }

                    .ant-input-prefix { 
                        color: var(--primary-color) !important; 
                        margin-right: 20px !important; 
                        opacity: 0.5;
                    }

                    .ant-input-suffix {
                        .toggle-eye {
                            color: rgba(255,255,255,0.3);
                            cursor: pointer;
                            transition: var(--transition-lux);
                            &:hover { color: #fff; }
                        }
                    }
                }
            }

            .btn-submit {
                height: 60px;
                background: var(--primary-color) !important;
                border: 1px solid var(--primary-color) !important;
                color: #000 !important;
                font-size: 0.75rem !important;
                font-weight: 600 !important;
                letter-spacing: 0.35em !important;
                text-transform: uppercase !important;
                border-radius: 0 !important;
                transition: var(--transition-lux) !important;
                margin-top: 1rem;
                
                &:hover:not(:disabled) {
                    background: transparent !important;
                    color: var(--primary-color) !important;
                }

                &:disabled {
                    opacity: 0.3;
                    border-color: var(--border-color) !important;
                    background: transparent !important;
                    color: #fff !important;
                }
            }
        }

        .password-requirements {
            margin-bottom: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 10px;

            p {
                margin: 0;
                font-size: 0.65rem;
                color: rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                gap: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                transition: var(--transition-lux);

                &.valid { color: var(--primary-color); opacity: 1; }
                
                span { font-size: 0.9rem; }
            }
        }

        .error-state, .success-state {
            .error-icon, .success-icon {
                font-size: 3.5rem;
                color: var(--primary-color);
                margin-bottom: 2rem;
                opacity: 0.8;
            }

            h2 {
                font-family: var(--font-serif);
                font-size: 2rem;
                color: #fff;
                margin-bottom: 1.5rem;
            }

            p {
                color: var(--text-muted);
                font-size: 0.95rem;
                line-height: 1.8;
                margin-bottom: 3rem;
            }

            .btn-action {
                height: 60px;
                background: var(--primary-color) !important;
                border: 1px solid var(--primary-color) !important;
                color: #000 !important;
                font-size: 0.75rem !important;
                font-weight: 600 !important;
                letter-spacing: 0.35em !important;
                text-transform: uppercase !important;
                border-radius: 0 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                
                &:hover {
                    background: transparent !important;
                    color: var(--primary-color) !important;
                }
            }
        }

        .fade-in { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
        }

        @media (max-width: 480px) {
            .reset-wrapper { padding: 0; }
            .reset-card {
                height: 100vh;
                max-width: 100%;
                padding: 4rem 2rem;
                border: none;
                .brand-header .logo { font-size: 2.5rem; }
            }
        }
    `]
})
export class ResetPasswordComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private message = inject(NzMessageService);

    token: string | null = null;
    newPassword = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
    isLoading = false;
    success = false;

    get isValid(): boolean {
        return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
    }

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    submitReset() {
        if (!this.isValid || !this.token) return;

        this.isLoading = true;
        this.authService.resetPassword(this.token, this.newPassword).subscribe({
            next: () => {
                this.isLoading = false;
                this.success = true;
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err.error?.message || 'Token inválido ou expirado');
            }
        });
    }
}
