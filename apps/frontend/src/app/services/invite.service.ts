import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InviteCode } from '../models';

export interface CreateInviteDto {
    email: string;
    courseIds: string[];
}

@Injectable({
    providedIn: 'root'
})
export class InviteService {
    private api = inject(ApiService);

    /**
     * Create new invite code (Admin only)
     */
    createInvite(data: CreateInviteDto): Observable<InviteCode> {
        return this.api.post<InviteCode>('/invites', data);
    }

    /**
     * Get all invite codes (Admin only)
     */
    getAllInvites(): Observable<InviteCode[]> {
        return this.api.get<InviteCode[]>('/invites');
    }

    /**
     * Get pending invites (Admin only)
     */
    getPendingInvites(): Observable<InviteCode[]> {
        return this.api.get<InviteCode[]>('/invites/pending');
    }

    /**
     * Cancel/Delete invite code (Admin only)
     */
    deleteInvite(code: string): Observable<void> {
        return this.api.delete<void>(`/invites/${code}`);
    }

    /**
     * Resend invite code (Admin only)
     */
    resendInvite(code: string): Observable<any> {
        return this.api.post<any>(`/invites/${code}/resend`, {});
    }
}
