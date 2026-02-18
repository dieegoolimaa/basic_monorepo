import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UploadResponse {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    type: 'image' | 'video';
    url: string;
    createdAt: Date;
}

export interface FileData {
    id: string;
    filename: string;
    mimeType: string;
    base64: string;
    size: number;
    type: string;
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private api = inject(ApiService);

    /**
     * Upload a file as base64
     * @param file File object from input
     * @param type 'image' or 'video'
     * @returns Observable with upload response
     */
    uploadFile(file: File, type: 'image' | 'video'): Observable<UploadResponse> {
        return new Observable(observer => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;

                const uploadDto = {
                    base64,
                    filename: file.name,
                    type
                };

                this.api.post<UploadResponse>('/uploads', uploadDto).subscribe({
                    next: (response) => observer.next(response),
                    error: (error) => observer.error(error),
                    complete: () => observer.complete()
                });
            };

            reader.onerror = (error) => observer.error(error);
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get file data by ID
     * @param id File ID
     */
    getFile(id: string): Observable<FileData> {
        return this.api.get<FileData>(`/uploads/${id}`);
    }

    /**
     * Delete file by ID
     * @param id File ID
     */
    deleteFile(id: string): Observable<{ message: string }> {
        return this.api.delete<{ message: string }>(`/uploads/${id}`);
    }

    /**
     * Convert File to base64 string
     * @param file File object
     * @returns Promise with base64 string
     */
    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    /**
     * Validate file size
     * @param file File object
     * @param maxSizeMB Maximum size in MB
     * @returns true if valid, false otherwise
     */
    validateFileSize(file: File, maxSizeMB: number): boolean {
        const sizeMB = file.size / (1024 * 1024);
        return sizeMB <= maxSizeMB;
    }

    /**
     * Validate image file type
     * @param file File object
     * @returns true if valid image, false otherwise
     */
    isValidImage(file: File): boolean {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(file.type);
    }

    /**
     * Validate video file type
     * @param file File object
     * @returns true if valid video, false otherwise
     */
    isValidVideo(file: File): boolean {
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        return validTypes.includes(file.type);
    }

    /**
     * Format file size to human readable string
     * @param bytes File size in bytes
     * @returns Formatted string (e.g., "2.5 MB")
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
