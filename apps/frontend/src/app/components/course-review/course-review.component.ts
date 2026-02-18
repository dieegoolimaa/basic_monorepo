import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReviewService, CreateReviewDto, Review } from '../../services/review.service';

@Component({
    selector: 'app-course-review',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzModalModule,
        NzButtonModule,
        NzInputModule,
        NzCheckboxModule,
        NzIconModule,
    ],
    templateUrl: './course-review.component.html',
    styleUrl: './course-review.component.scss',
})
export class CourseReviewComponent implements OnInit {
    @Input() courseId!: string;
    @Input() courseName!: string;
    @Input() isVisible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() reviewSubmitted = new EventEmitter<Review>();

    private reviewService = inject(ReviewService);
    private message = inject(NzMessageService);

    rating = signal(0);
    comment = signal('');
    isAnonymous = signal(false);
    isSubmitting = signal(false);
    existingReview = signal<Review | null>(null);
    hoverRating = 0;

    ngOnInit() {
        this.checkExistingReview();
    }

    checkExistingReview() {
        if (this.courseId) {
            this.reviewService.getMyReviewForCourse(this.courseId).subscribe({
                next: (review) => {
                    if (review) {
                        this.existingReview.set(review);
                        this.rating.set(review.rating);
                        this.comment.set(review.comment || '');
                        this.isAnonymous.set(review.isAnonymous);
                    }
                },
            });
        }
    }

    setRating(value: number) {
        this.rating.set(value);
    }

    submit() {
        if (this.rating() === 0) {
            this.message.warning('Por favor, selecione uma nota para o curso');
            return;
        }

        this.isSubmitting.set(true);

        const reviewData: CreateReviewDto = {
            courseId: this.courseId,
            rating: this.rating(),
            comment: this.comment() || undefined,
            isAnonymous: this.isAnonymous(),
        };

        const action = this.existingReview()
            ? this.reviewService.updateReview(this.existingReview()!._id, reviewData)
            : this.reviewService.createReview(reviewData);

        action.subscribe({
            next: (review) => {
                this.message.success(this.existingReview()
                    ? 'Avaliação atualizada com sucesso!'
                    : 'Obrigada pela sua avaliação! 💖');
                this.reviewSubmitted.emit(review);
                this.close();
            },
            error: (error) => {
                console.error('Error submitting review:', error);
                this.message.error('Erro ao enviar avaliação. Tente novamente.');
            },
            complete: () => {
                this.isSubmitting.set(false);
            },
        });
    }

    close() {
        this.visibleChange.emit(false);
    }

    getRatingText(): string {
        const texts = [
            '',
            'Precisa melhorar',
            'Regular',
            'Bom',
            'Muito bom',
            'Excelente! 🌟'
        ];
        return texts[this.rating()] || '';
    }
}
