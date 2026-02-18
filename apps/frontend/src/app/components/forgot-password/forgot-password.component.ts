import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzInputModule,
        NzFormModule,
        NzIconModule,
        NzMessageModule,
        NzResultModule
    ],
    template: `
    <div class="forgot-wrapper">
        <div class="forgot-card fade-in">
            <!-- Request Form -->
            <ng-container *ngIf="!emailSent">
                <div class="brand-header">
                    <div class="logo">basic.</div>
                    <p class="subtitle">Recuperação de Acesso</p>
                </div>

                <p class="description">
                    Digite seu email cadastrado e enviaremos as instruções para redefinir sua senha com segurança.
                </p>

                <form (ngSubmit)="submitRequest()" class="forgot-form">
                    <nz-form-item>
                        <nz-form-control nzErrorTip="Por favor insira um email válido">
                            <nz-input-group [nzPrefix]="prefixMail">
                                <input nz-input placeholder="Email" [(ngModel)]="email" name="email" 
                                       type="email" required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixMail>
                                <span nz-icon nzType="mail" class="input-icon"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

                    <button nz-button nzType="primary" nzBlock nzSize="large" 
                            [nzLoading]="isLoading" class="btn-submit">
                        ENVIAR INSTRUÇÕES
                    </button>
                </form>

                <div class="forgot-footer">
                    <a routerLink="/login" class="back-link">
                        <span nz-icon nzType="arrow-left"></span>
                        VOLTAR PARA O LOGIN
                    </a>
                </div>
            </ng-container>

            <!-- Success Message -->
            <ng-container *ngIf="emailSent">
                <div class="success-state">
                    <div class="success-icon">
                        <span nz-icon nzType="check-circle" nzTheme="outline"></span>
                    </div>
                    <h2>Email enviado!</h2>
                    <p>
                        Se existe uma conta com o email <strong>{{ email }}</strong>, 
                        você receberá um link de recuperação em instantes.
                    </p>
                    <p class="hint">NÃO ESQUEÇA DE VERIFICAR SUA CAIXA DE SPAM.</p>
                    
                    <a routerLink="/login" nz-button nzType="primary" nzSize="large" class="btn-back">
                        VOLTAR PARA O LOGIN
                    </a>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styles: [`
        .forgot-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--background-color);
            background-image: 
                radial-gradient(circle at 20% 30%, rgba(229, 213, 176, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(229, 213, 176, 0.03) 0%, transparent 50%);
            padding: 20px;
            z-index: 2000;
        }

        .forgot-card {
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

        .description {
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-bottom: 3rem;
            line-height: 1.8;
            letter-spacing: 0.02em;
        }

        .forgot-form {
            text-align: left;

            nz-form-item { margin-bottom: 2.5rem; }

            ::ng-deep {
                .ant-input-affix-wrapper {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid var(--border-color) !important;
                    border-radius: 0 !important;
                    padding: 15px 0 !important;
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
                        font-size: 1.1rem;
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
                
                &:hover {
                    background: transparent !important;
                    color: var(--primary-color) !important;
                    box-shadow: 0 10px 30px rgba(229, 213, 176, 0.15);
                }
            }
        }

        .forgot-footer {
            margin-top: 3rem;

            .back-link {
                color: var(--text-muted);
                font-size: 0.65rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: var(--transition-lux);

                &:hover { color: #fff; }
            }
        }

        .success-state {
            .success-icon {
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
                margin-bottom: 1.5rem;
                strong { color: #fff; }
            }

            .hint {
                font-size: 0.65rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                margin-bottom: 3rem;
                opacity: 0.5;
            }

            .btn-back {
                height: 60px;
                background: var(--primary-color) !important;
                border: 1px solid var(--primary-color) !important;
                color: #000 !important;
                font-size: 0.75rem !important;
                font-weight: 600 !important;
                letter-spacing: 0.35em !important;
                text-transform: uppercase !important;
                border-radius: 0 !important;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                
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
            .forgot-wrapper { padding: 0; }
            .forgot-card {
                height: 100vh;
                max-width: 100%;
                padding: 4rem 2rem;
                border: none;
                .brand-header .logo { font-size: 2.5rem; }
            }
        }
    `]
})
export class ForgotPasswordComponent {
    private authService = inject(AuthService);
    private message = inject(NzMessageService);

    email = '';
    isLoading = false;
    emailSent = false;

    submitRequest() {
        if (!this.email) {
            this.message.warning('Por favor, insira seu email');
            return;
        }

        this.isLoading = true;
        this.authService.requestPasswordReset(this.email).subscribe({
            next: () => {
                this.isLoading = false;
                this.emailSent = true;
            },
            error: () => {
                this.isLoading = false;
                // Always show success to prevent email enumeration
                this.emailSent = true;
            }
        });
    }
}
