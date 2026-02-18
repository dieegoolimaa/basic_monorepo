import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzInputModule,
        NzIconModule,
        NzMessageModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private message = inject(NzMessageService);

    step = 1;

    // Step 1
    inviteCode = '';
    isValidating = false;
    codeValid = false;
    codeError = '';

    // Step 2
    name = '';
    email = '';
    phone = '';
    address = '';
    city = '';
    password = '';
    confirmPassword = '';
    isLoading = false;
    registerError = '';

    validateCode() {
        if (!this.inviteCode.trim()) return;

        this.isValidating = true;
        this.codeError = '';
        this.codeValid = false;

        this.authService.validateInviteCode(this.inviteCode).subscribe({
            next: (result) => {
                this.isValidating = false;
                if (result.valid) {
                    this.codeValid = true;
                    setTimeout(() => {
                        this.step = 2;
                    }, 500);
                } else {
                    this.codeError = 'Código inválido. Verifique e tente novamente.';
                }
            },
            error: () => {
                this.isValidating = false;
                this.codeError = 'Erro ao validar. Tente novamente.';
            }
        });
    }

    register() {
        this.registerError = '';

        if (!this.name || !this.email || !this.phone || !this.password) {
            this.registerError = 'Preencha todos os campos obrigatórios.';
            return;
        }

        if (this.password.length < 6) {
            this.registerError = 'A senha deve ter pelo menos 6 caracteres.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.registerError = 'As senhas não coincidem.';
            return;
        }

        this.isLoading = true;

        this.authService.register({
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address,
            city: this.city,
            password: this.password,
            inviteCode: this.inviteCode
        }).subscribe({
            next: () => {
                this.isLoading = false;
                this.message.success('Conta criada com sucesso! Bem-vinda!');
                this.router.navigate(['/formacoes']);
            },
            error: (err) => {
                this.isLoading = false;
                this.registerError = err.message || 'Erro ao criar conta.';
            }
        });
    }
}
