import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HomeBanner, SiteSettings } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HomeContentService {
    private api = inject(ApiService);

    private bannersSignal = signal<HomeBanner[]>([]);
    readonly banners = this.bannersSignal.asReadonly();

    private settingsSignal = signal<SiteSettings | null>(null);
    readonly settings = this.settingsSignal.asReadonly();

    // ========== BANNERS ==========

    /**
     * Load all active banners
     */
    loadBanners() {
        this.api.get<HomeBanner[]>('/banners').subscribe({
            next: (banners) => this.bannersSignal.set(banners),
            error: (err) => console.error('Error loading banners', err)
        });
    }

    /**
     * Get all banners (Admin)
     */
    getAllBanners(): Observable<HomeBanner[]> {
        return this.api.get<HomeBanner[]>('/banners/admin').pipe(
            tap(banners => this.bannersSignal.set(banners))
        );
    }

    /**
     * Add new banner
     */
    addBanner(data: { imageUrl: string; title?: string; subtitle?: string }): Observable<HomeBanner> {
        return this.api.post<HomeBanner>('/banners', data).pipe(
            tap(newBanner => {
                this.bannersSignal.update(banners => [...banners, newBanner]);
            })
        );
    }

    /**
     * Update banner
     */
    updateBanner(id: string, data: Partial<HomeBanner>): Observable<HomeBanner> {
        return this.api.put<HomeBanner>(`/banners/${id}`, data).pipe(
            tap(updated => {
                this.bannersSignal.update(banners =>
                    banners.map(b => b._id === id ? updated : b)
                );
            })
        );
    }

    /**
     * Remove banner
     */
    removeBanner(id: string): Observable<void> {
        return this.api.delete<void>(`/banners/${id}`).pipe(
            tap(() => {
                this.bannersSignal.update(banners =>
                    banners.filter(b => b._id !== id)
                );
            })
        );
    }

    /**
     * Toggle banner active status
     */
    toggleBannerStatus(id: string): Observable<HomeBanner> {
        return this.api.put<HomeBanner>(`/banners/${id}/toggle`, {}).pipe(
            tap(updated => {
                this.bannersSignal.update(banners =>
                    banners.map(b => b._id === id ? updated : b)
                );
            })
        );
    }

    // ========== SITE SETTINGS ==========

    /**
     * Load site settings
     */
    loadSettings() {
        this.api.get<SiteSettings>('/settings').subscribe({
            next: (settings) => this.settingsSignal.set(settings),
            error: (err) => console.error('Error loading settings', err)
        });
    }

    /**
     * Get site settings (returns Observable)
     */
    getSettings(): Observable<SiteSettings> {
        return this.api.get<SiteSettings>('/settings').pipe(
            tap(settings => this.settingsSignal.set(settings))
        );
    }

    /**
     * Update site settings (Admin)
     */
    updateSettings(data: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.api.put<SiteSettings>('/settings', data).pipe(
            tap(updated => this.settingsSignal.set(updated))
        );
    }
}
