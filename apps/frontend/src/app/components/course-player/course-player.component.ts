import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { Course, Lesson, ProcedureStep } from '../../models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseReviewComponent } from '../course-review/course-review.component';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzMessageModule,
    CourseReviewComponent
  ],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private sanitizer = inject(DomSanitizer);
  private message = inject(NzMessageService);

  course = signal<Course | null>(null);
  currentLesson = signal<Lesson | null>(null);
  completedLessons = signal<string[]>([]);
  isSidebarOpen = signal(false);

  // Review modal
  showReviewModal = signal(false);
  hasReviewed = signal(false);

  // Quiz state
  quizAnswers = signal<Record<string, number>>({});
  quizSubmitted = signal(false);
  quizScore = signal(0);
  quizPassed = signal(false);

  currentVideoUrl = computed(() => {
    const lesson = this.currentLesson();
    if (!lesson || ['text', 'quiz'].includes(lesson.contentType || '')) return null;
    if (lesson.videoUrl && lesson.videoUrl.trim()) {
      return this.processVideoUrl(lesson.videoUrl);
    }
    return null;
  });

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      // Check if user has access to this course
      if (!this.authService.canAccessCourse(courseId)) {
        this.message.error('Você não tem acesso a este curso');
        this.router.navigate(['/formacoes', courseId]);
        return;
      }

      this.courseService.getCourseById(courseId).subscribe(c => {
        this.course.set(c);
        if (c.modules.length > 0 && c.modules[0].lessons.length > 0) {
          this.currentLesson.set(c.modules[0].lessons[0]);
        }
      });

      // Load user progress
      this.loadProgress();

      // Check if user already reviewed this course
      this.checkExistingReview(courseId);
    }
  }

  checkExistingReview(courseId: string) {
    this.reviewService.getMyReviewForCourse(courseId).subscribe({
      next: (review) => {
        this.hasReviewed.set(review !== null);
      },
      error: () => {
        // Ignore error, assume not reviewed
      }
    });
  }

  loadProgress() {
    this.userService.getMyProgress().subscribe({
      next: (progress) => {
        this.completedLessons.set(progress.completedLessons || []);
      },
      error: () => {
        // User might not be logged in
      }
    });
  }

  selectLesson(lesson: Lesson) {
    // Check if lesson is unlocked before allowing access
    if (!this.isLessonUnlocked(lesson.id)) {
      this.message.warning('Complete as aulas anteriores primeiro');
      return;
    }

    this.currentLesson.set(lesson);
    // Reset quiz state when changing lessons
    this.retryQuiz();
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons().includes(lessonId);
  }

  isLessonUnlocked(lessonId: string): boolean {
    const course = this.course();
    if (!course) return false;

    const allLessons: Lesson[] = [];
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        allLessons.push(lesson);
      }
    }

    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === 0) return true; // First lesson is always unlocked

    // Check if previous lesson is completed
    const previousLesson = allLessons[lessonIndex - 1];
    return this.isLessonCompleted(previousLesson.id);
  }

  isModuleReached(index: number): boolean {
    if (index === 0) return true;
    const course = this.course();
    if (!course) return false;

    // A module is reached if at least one lesson of it is unlocked
    // Or more strictly: if the previous module is completely finished
    const prevModule = course.modules[index - 1];
    if (!prevModule || prevModule.lessons.length === 0) return true;
    const lastLessonOfPrev = prevModule.lessons[prevModule.lessons.length - 1];
    return this.isLessonCompleted(lastLessonOfPrev.id);
  }

  toggleStep(step: ProcedureStep) {
    step.isCompleted = !step.isCompleted;
  }

  markAsCompleted() {
    const lesson = this.currentLesson();
    const course = this.course();
    if (!lesson || !course) return;

    // Mark as completed in backend
    this.userService.markLessonComplete(lesson.id).subscribe({
      next: () => {
        this.completedLessons.update(lessons => [...lessons, lesson.id]);
        this.message.success('Aula concluída! 🎉');

        // Check if course is complete AND user hasn't reviewed yet
        if (this.isCourseComplete() && !this.hasReviewed()) {
          this.showReviewModal.set(true);
        } else {
          this.nextLesson();
        }
      },
      error: () => {
        this.message.error('Erro ao salvar progresso');
      }
    });
  }

  isCourseComplete(): boolean {
    const course = this.course();
    if (!course) return false;

    const totalLessons = this.getTotalLessons();
    const completed = this.completedLessons().length;
    return completed >= totalLessons;
  }

  getProgress(): number {
    const total = this.getTotalLessons();
    if (total === 0) return 0;
    return Math.round((this.completedLessons().length / total) * 100);
  }

  nextLesson() {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return;

    let foundCurrent = false;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (foundCurrent) {
          this.currentLesson.set(lesson);
          return;
        }
        if (lesson.id === current.id) {
          foundCurrent = true;
        }
      }
    }

    // No more lessons - course complete
    this.message.info('Parabéns! Você concluiu todas as aulas!');
    this.showReviewModal.set(true);
  }

  previousLesson() {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return;

    let prevLesson: Lesson | null = null;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === current.id && prevLesson) {
          this.currentLesson.set(prevLesson);
          return;
        }
        prevLesson = lesson;
      }
    }
  }

  hasPrevious(): boolean {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return false;

    return !(course.modules[0]?.lessons[0]?.id === current.id);
  }

  hasNext(): boolean {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return false;

    const lastModule = course.modules[course.modules.length - 1];
    const lastLesson = lastModule?.lessons[lastModule.lessons.length - 1];
    return current.id !== lastLesson?.id;
  }

  getTotalLessons(): number {
    const course = this.course();
    if (!course) return 0;
    return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
  }

  getLessonIcon(lesson: Lesson): string {
    if (this.isLessonCompleted(lesson.id)) return 'check-circle';
    switch (lesson.contentType) {
      case 'video': return 'play-circle';
      case 'text': return 'file-text';
      case 'quiz': return 'question-circle';
      case 'mixed': return 'experiment';
      default: return 'file';
    }
  }

  getTypeLabel(contentType: string | undefined): string {
    if (!contentType) return '';
    const labels: { [key: string]: string } = {
      'video': 'Vídeo',
      'text': 'Texto',
      'quiz': 'Quiz',
      'mixed': 'Misto'
    };
    return labels[contentType] || contentType;
  }

  onReviewSubmitted() {
    this.showReviewModal.set(false);
    this.message.success('Obrigada pela avaliação! 💖');
  }

  closeReviewModal() {
    this.showReviewModal.set(false);
  }

  private processVideoUrl(url: string): SafeResourceUrl {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return this.getSafeUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`);
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return this.getSafeUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
    }

    return this.getSafeUrl(url);
  }

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Quiz Methods
  selectQuizAnswer(questionId: string, optionIndex: number) {
    this.quizAnswers.update(answers => ({
      ...answers,
      [questionId]: optionIndex
    }));
  }

  allQuestionsAnswered(): boolean {
    const lesson = this.currentLesson();
    if (!lesson?.quiz?.questions) return false;
    const answers = this.quizAnswers();
    return lesson.quiz.questions.every(q => answers[q.id] !== undefined);
  }

  submitQuiz() {
    const lesson = this.currentLesson();
    if (!lesson?.quiz?.questions) return;

    const { correct, total } = this.calculateScore();
    const score = Math.round((correct / total) * 100);
    const minPass = lesson.quiz.minPassScore || 70;

    this.quizScore.set(score);
    this.quizPassed.set(score >= minPass);
    this.quizSubmitted.set(true);

    if (score >= minPass) {
      this.message.success(`Parabéns! Você acertou ${correct} de ${total} questões! 🎉`);
    } else {
      this.message.warning(`Você acertou ${correct} de ${total}. Tente novamente!`);
    }
  }

  getCorrectCount(): number {
    return this.calculateScore().correct;
  }

  private calculateScore(): { correct: number; total: number } {
    const lesson = this.currentLesson();
    if (!lesson?.quiz?.questions) return { correct: 0, total: 0 };

    const answers = this.quizAnswers();
    let correct = 0;

    for (const question of lesson.quiz.questions) {
      if (answers[question.id] === question.correctOptionIndex) {
        correct++;
      }
    }

    return { correct, total: lesson.quiz.questions.length };
  }

  retryQuiz() {
    this.quizAnswers.set({});
    this.quizSubmitted.set(false);
    this.quizScore.set(0);
    this.quizPassed.set(false);
  }
}
