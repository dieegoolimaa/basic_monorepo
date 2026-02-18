import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { User, InviteCode, Course } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { InviteService } from '../../services/invite.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-admin-user-manager',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        NzInputModule,
        NzMessageModule,
        NzToolTipModule,
        NzCheckboxModule
    ],
    templateUrl: './admin-user-manager.component.html',
    styleUrl: './admin-user-manager.component.scss'
})
export class AdminUserManagerComponent implements OnInit {
    private message = inject(NzMessageService);
    private authService = inject(AuthService);
    private courseService = inject(CourseService);
    private inviteService = inject(InviteService);
    private userService = inject(UserService);

    users: User[] = [];
    inviteCodes: InviteCode[] = [];
    courses: Course[] = [];

    // Create Invite Modal
    isInviteModalVisible = false;
    newInviteEmail = '';
    courseSelection: { [courseId: string]: boolean } = {};
    generatedCode = '';
    isSending = false;

    // Edit User Modal
    isEditModalVisible = false;
    editingUser: User | null = null;
    editCourseSelection: { [courseId: string]: boolean } = {};

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        // Load courses
        this.courseService.getAllCourses().subscribe(courses => {
            this.courses = courses;
            // Initialize course selection
            courses.forEach(c => {
                this.courseSelection[c._id] = false;
            });
        });

        // Load pending invites
        this.inviteService.getPendingInvites().subscribe(invites => {
            this.inviteCodes = invites;
        });

        // Load users from API
        this.userService.getAllStudents().subscribe(users => {
            this.users = users;
        });
    }

    getActiveUsers(): number {
        return this.users.filter(u => u.isActive).length;
    }

    getInitials(name: string): string {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    getCourseNames(enrolledCourses: any[]): string {
        if (!enrolledCourses || enrolledCourses.length === 0) return 'Nenhum curso';

        return enrolledCourses.map((courseOrId: any) => {
            // If populated object, use title directly
            if (typeof courseOrId === 'object' && courseOrId.title) {
                return courseOrId.title;
            }
            // If string ID, find in courses array
            const course = this.courses.find(c => c._id === courseOrId);
            return course?.title || courseOrId;
        }).join(', ');
    }

    hasSelectedCourses(): boolean {
        return Object.values(this.courseSelection).some(v => v);
    }

    getSelectedCourseIds(): string[] {
        return Object.entries(this.courseSelection)
            .filter(([_, selected]) => selected)
            .map(([id, _]) => id);
    }

    // Invite Management
    showInviteModal() {
        this.isInviteModalVisible = true;
        this.newInviteEmail = '';
        this.generatedCode = '';
        this.isSending = false;
        // Reset course selection
        Object.keys(this.courseSelection).forEach(k => this.courseSelection[k] = false);
    }

    closeInviteModal() {
        this.isInviteModalVisible = false;
        this.generatedCode = '';
    }

    createAnother() {
        this.newInviteEmail = '';
        this.generatedCode = '';
        Object.keys(this.courseSelection).forEach(k => this.courseSelection[k] = false);
    }

    createInvite() {
        if (!this.newInviteEmail || !this.hasSelectedCourses()) {
            this.message.warning('Preencha o email e selecione pelo menos um curso');
            return;
        }

        this.isSending = true;

        const courseIds = this.getSelectedCourseIds();

        // Create invite via API
        this.inviteService.createInvite({ email: this.newInviteEmail, courseIds }).subscribe({
            next: (invite) => {
                this.generatedCode = invite.code;
                this.inviteCodes.push(invite);
                this.isSending = false;
                this.message.success(`Convite criado com sucesso!`);
            },
            error: (err) => {
                this.isSending = false;
                this.message.error(err.message || 'Erro ao criar convite');
            }
        });
    }

    resendInvite(invite: InviteCode) {
        this.message.success(`Convite reenviado para ${invite.email}`);
    }

    copyCode(code: string) {
        navigator.clipboard.writeText(code).then(() => {
            this.message.success('Código copiado!');
        });
    }

    deleteInvite(code: string) {
        this.inviteService.deleteInvite(code).subscribe(() => {
            this.inviteCodes = this.inviteCodes.filter(i => i.code !== code);
            this.message.success('Convite cancelado');
        });
    }

    // User Management
    resendPassword(user: User) {
        this.message.success(`Link de redefinição enviado para ${user.email}`);
    }

    editUser(user: User) {
        this.editingUser = user;

        // Get enrolled course IDs - handle both populated objects and plain IDs
        const enrolledIds = (user.enrolledCourses || []).map((course: any) => {
            // If populated as object, get _id; otherwise it's already a string
            return typeof course === 'object' ? course._id : course;
        });

        // Initialize edit course selection
        this.courses.forEach(c => {
            this.editCourseSelection[c._id] = enrolledIds.includes(c._id);
        });
        this.isEditModalVisible = true;
    }

    saveUserCourses() {
        if (this.editingUser) {
            const newCourses = Object.entries(this.editCourseSelection)
                .filter(([_, selected]) => selected)
                .map(([id, _]) => id);

            // Update via API - use the correct endpoint for updating courses
            this.userService.updateUserCourses(this.editingUser._id, newCourses).subscribe({
                next: (updated) => {
                    // Update local array
                    const idx = this.users.findIndex(u => u._id === this.editingUser?._id);
                    if (idx >= 0) {
                        this.users[idx] = updated;
                    }
                    this.message.success('Cursos atualizados com sucesso');
                    this.isEditModalVisible = false;
                    this.editingUser = null;
                },
                error: (err) => {
                    console.error('Error updating courses:', err);
                    this.message.error('Erro ao atualizar cursos');
                }
            });
        }
    }

    toggleUserStatus(user: User) {
        const newStatus = !user.isActive;

        // Update via API
        this.userService.toggleUserStatus(user._id, newStatus).subscribe({
            next: (updated) => {
                // Update local array
                const idx = this.users.findIndex(u => u._id === user._id);
                if (idx >= 0) {
                    this.users[idx] = updated;
                }
                this.message.success(`Aluna ${newStatus ? 'ativada' : 'desativada'}`);
            },
            error: (err) => {
                this.message.error('Erro ao atualizar status');
            }
        });
    }
}
