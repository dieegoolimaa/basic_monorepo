import { Injectable, inject } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { ApiService } from './api.service';

export interface Review {
    _id: string;
    userId: string | { _id: string; name: string; avatar?: string };
    courseId: string;
    rating: number;
    comment?: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface AdminReview {
    _id: string;
    userId: { _id: string; name: string; email: string };
    courseId: { _id: string; title: string; thumbnailUrl?: string };
    rating: number;
    comment?: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface CourseStats {
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
}

export interface CreateReviewDto {
    courseId: string;
    rating: number;
    comment?: string;
    isAnonymous?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private api = inject(ApiService);

    createReview(data: CreateReviewDto): Observable<Review> {
        return this.api.post<Review>('/reviews', data);
    }

    updateReview(reviewId: string, data: Partial<CreateReviewDto>): Observable<Review> {
        return this.api.put<Review>(`/reviews/${reviewId}`, data);
    }

    deleteReview(reviewId: string): Observable<void> {
        return this.api.delete<void>(`/reviews/${reviewId}`);
    }

    getCourseReviews(courseId: string): Observable<Review[]> {
        return this.api.get<Review[]>(`/reviews/course/${courseId}`);
    }

    getCourseStats(courseId: string): Observable<CourseStats> {
        return this.api.get<CourseStats>(`/reviews/course/${courseId}/stats`);
    }

    getMyReviews(): Observable<Review[]> {
        return this.api.get<Review[]>('/reviews/me');
    }

    getMyReviewForCourse(courseId: string): Observable<Review | null> {
        return this.api.get<Review | null>(`/reviews/me/course/${courseId}`).pipe(
            catchError(() => of(null))
        );
    }

    // Admin methods
    getAllReviews(): Observable<AdminReview[]> {
        return this.api.get<AdminReview[]>('/reviews/admin/all');
    }
}

