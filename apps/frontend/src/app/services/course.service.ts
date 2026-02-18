import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private api = inject(ApiService);

    // Signal for state management
    private coursesSignal = signal<Course[]>([]);
    readonly courses = this.coursesSignal.asReadonly();

    /**
     * Get all courses (public)
     */
    getAllCourses(): Observable<Course[]> {
        return this.api.get<Course[]>('/courses').pipe(
            tap(data => {
                this.coursesSignal.set(data);
            })
        );
    }

    /**
     * Get courses with ratings
     */
    getCoursesWithRatings(): Observable<any[]> {
        return this.api.get<any[]>('/courses/with-ratings');
    }

    /**
     * Get all courses (Admin)
     */
    getAllCoursesAdmin(): Observable<Course[]> {
        return this.api.get<Course[]>('/courses/admin').pipe(
            tap(data => {
                this.coursesSignal.set(data);
            })
        );
    }

    /**
     * Get course by ID
     */
    getCourseById(id: string): Observable<Course> {
        return this.api.get<Course>(`/courses/${id}`);
    }

    /**
     * Create new course (Admin)
     */
    createCourse(course: Partial<Course>): Observable<Course> {
        return this.api.post<Course>('/courses', course).pipe(
            tap(newCourse => {
                this.coursesSignal.update(courses => [...courses, newCourse]);
            })
        );
    }

    /**
     * Update course (Admin)
     */
    updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
        return this.api.put<Course>(`/courses/${id}`, updates).pipe(
            tap(updatedCourse => {
                this.coursesSignal.update(courses =>
                    courses.map(c => c._id === id ? updatedCourse : c)
                );
            })
        );
    }

    /**
     * Delete course (Admin)
     */
    deleteCourse(id: string): Observable<void> {
        return this.api.delete<void>(`/courses/${id}`).pipe(
            tap(() => {
                this.coursesSignal.update(courses =>
                    courses.filter(c => c._id !== id)
                );
            })
        );
    }
}
