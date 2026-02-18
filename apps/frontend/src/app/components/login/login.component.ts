import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private message = inject(NzMessageService);

  email = '';
  password = '';
  isLoading = false;
  returnUrl = '/formacoes';

  ngOnInit() {
    // Captura returnUrl se existir
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/formacoes';
  }

  submitForm() {
    if (!this.email || !this.password) {
      this.message.error('Preencha todos os campos');
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Check if user must change password (first-login flow)
        if (response.user.mustChangePassword) {
          this.message.info('Por segurança, defina uma nova senha.');
          this.router.navigate(['/alterar-senha']);
          return;
        }

        this.message.success('Login realizado com sucesso!');

        // If there's a specific return URL, use it
        if (this.returnUrl !== '/formacoes') {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // Otherwise, redirect based on role
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/meus-cursos']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.message || 'Credenciais inválidas');
      }
    });
  }
}
