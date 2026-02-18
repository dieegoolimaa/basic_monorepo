import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { User } from '../../models';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-admin-manager',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        NzInputModule,
        NzMessageModule,
        NzToolTipModule,
        NzPopconfirmModule
    ],
    templateUrl: './admin-admin-manager.component.html',
    styleUrl: './admin-admin-manager.component.scss'
})
export class AdminAdminManagerComponent implements OnInit {
    private message = inject(NzMessageService);
    private userService = inject(UserService);
    private authService = inject(AuthService);

    admins: User[] = [];
    currentUserId: string = '';

    // Create Admin Modal
    isCreateModalVisible = false;
    newAdminName = '';
    newAdminEmail = '';
    isCreating = false;

    ngOnInit() {
        this.loadData();
        // Get current user ID to prevent self-deletion
        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.currentUserId = currentUser._id;
        }
    }

    loadData() {
        this.userService.getAllAdmins().subscribe({
            next: (admins) => {
                this.admins = admins;
            },
            error: (err) => {
                this.message.error('Erro ao carregar administradores');
            }
        });
    }

    getInitials(name: string): string {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    // Modal Management
    showCreateModal() {
        this.isCreateModalVisible = true;
        this.newAdminName = '';
        this.newAdminEmail = '';
        this.isCreating = false;
    }

    closeCreateModal() {
        this.isCreateModalVisible = false;
    }

    createAdmin() {
        if (!this.newAdminName || !this.newAdminEmail) {
            this.message.warning('Preencha todos os campos');
            return;
        }

        this.isCreating = true;

        this.userService.createAdmin({
            name: this.newAdminName,
            email: this.newAdminEmail
        }).subscribe({
            next: (admin) => {
                this.admins.push(admin);
                this.message.success('Administrador criado! Credenciais enviadas por email.');
                this.closeCreateModal();
                this.isCreating = false;
            },
            error: (err) => {
                this.isCreating = false;
                this.message.error(err.error?.message || 'Erro ao criar administrador');
            }
        });
    }

    deleteAdmin(admin: User) {
        if (admin._id === this.currentUserId) {
            this.message.warning('Você não pode excluir sua própria conta');
            return;
        }

        this.userService.deleteUser(admin._id).subscribe({
            next: () => {
                this.admins = this.admins.filter(a => a._id !== admin._id);
                this.message.success('Administrador removido');
            },
            error: () => {
                this.message.error('Erro ao remover administrador');
            }
        });
    }

    canDelete(admin: User): boolean {
        return admin._id !== this.currentUserId;
    }
}
