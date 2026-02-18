import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CourseService } from '../../services/course.service';
import { Course, Lesson, QuizQuestion } from '../../models';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-course-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzUploadModule,
    NzTabsModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzTagModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule,
    NzPageHeaderModule,
    NzLayoutModule,
    NzMenuModule,
    NzRadioModule,
    RouterModule
  ],
  templateUrl: './admin-course-manager.component.html',
  styleUrl: './admin-course-manager.component.scss'
})
export class AdminCourseManagerComponent implements OnInit {
  private courseService = inject(CourseService);
  private message = inject(NzMessageService);

  courses: Course[] = [];
  isLoading = false;
  isUploadingImage = false;
  isUploadingVideo = false;
  isEditingMode = false;
  videoInputType: 'url' | 'file' = 'url';

  currentCourse: Partial<Course> = {};
  selectedLesson: Lesson | null = null;
  activeModuleIndex = 0;

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCoursesAdmin().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.message.error('Erro ao carregar cursos');
        this.isLoading = false;
      }
    });
  }

  // --- ACTIONS ---

  createNewCourse() {
    this.currentCourse = {
      title: 'Nova Formação',
      description: '',
      thumbnailUrl: '',
      imageUrl: '',
      modules: [],
      instructor: 'Cris Souza',
      isActive: true
    };
    this.isEditingMode = true;
    this.selectedLesson = null;
  }

  editCourse(course: Course) {
    this.currentCourse = JSON.parse(JSON.stringify(course)); // Deep copy
    this.isEditingMode = true;
    if (this.currentCourse.modules && this.currentCourse.modules.length > 0) {
      this.activeModuleIndex = 0;
      if (this.currentCourse.modules[0].lessons.length > 0) {
        this.selectedLesson = this.currentCourse.modules[0].lessons[0];
      }
    } else {
      this.selectedLesson = null;
    }
  }

  deleteCourse(id: string) {
    if (confirm('Tem certeza que deseja deletar este curso?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== id);
          this.message.success('Curso removido com sucesso');
        },
        error: (err) => {
          this.message.error('Erro ao remover curso');
        }
      });
    }
  }

  saveCourse() {
    this.isLoading = true;
    if (this.currentCourse._id) {
      // Update existing course
      this.courseService.updateCourse(this.currentCourse._id, this.currentCourse).subscribe({
        next: (updated) => {
          const idx = this.courses.findIndex(c => c._id === this.currentCourse._id);
          if (idx !== -1) this.courses[idx] = updated;
          this.isEditingMode = false;
          this.isLoading = false;
          this.message.success('Curso atualizado com sucesso!');
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error('Erro ao atualizar curso');
        }
      });
    } else {
      // Create new course
      this.courseService.createCourse(this.currentCourse).subscribe({
        next: (newCourse) => {
          this.courses.push(newCourse);
          this.isEditingMode = false;
          this.isLoading = false;
          this.message.success('Curso criado com sucesso!');
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error('Erro ao criar curso');
        }
      });
    }
  }

  cancelEdit() {
    // Could add confirm check if dirty
    this.isEditingMode = false;
    this.selectedLesson = null;
  }

  // --- EDITOR LOGIC ---

  addModule() {
    if (!this.currentCourse.modules) this.currentCourse.modules = [];
    this.currentCourse.modules.push({ id: Date.now().toString(), title: 'Novo Módulo', lessons: [] });
    this.activeModuleIndex = this.currentCourse.modules.length - 1;
  }

  removeModule(index: number) {
    if (confirm('Remover este módulo e suas aulas?')) {
      this.currentCourse.modules?.splice(index, 1);
      this.selectedLesson = null;
    }
  }

  handleModuleClick(index: number) {
    this.activeModuleIndex = index;
  }

  addLesson(moduleIndex: number) {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: 'Nova Aula',
      duration: '00:00',
      contentType: 'video'
    };
    this.currentCourse.modules![moduleIndex].lessons.push(newLesson);
    this.selectedLesson = newLesson;
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'video': return 'play-circle';
      case 'text': return 'file-text';
      case 'quiz': return 'question-circle';
      case 'mixed': return 'experiment';
      default: return 'file';
    }
  }

  // --- QUIZ & STEPS HELPERS ---

  getQuizQuestions(lesson: Lesson): QuizQuestion[] {
    if (!lesson.quiz) lesson.quiz = { minPassScore: 70, questions: [] };
    return lesson.quiz.questions;
  }

  addQuestion(lesson: Lesson) {
    if (!lesson.quiz) lesson.quiz = { minPassScore: 70, questions: [] };
    lesson.quiz.questions.push({
      id: Date.now().toString(),
      question: '',
      options: ['Opção A', 'Opção B'],
      correctOptionIndex: 0
    });
  }

  removeQuestion(lesson: Lesson, idx: number) {
    lesson.quiz?.questions.splice(idx, 1);
  }

  getSteps(lesson: Lesson) {
    if (!lesson.procedureSteps) lesson.procedureSteps = [];
    return lesson.procedureSteps;
  }

  addStep(lesson: Lesson) {
    if (!lesson.procedureSteps) lesson.procedureSteps = [];
    lesson.procedureSteps.push({ step: lesson.procedureSteps.length + 1, description: '', tips: [] });
  }

  removeStep(lesson: Lesson, idx: number) {
    lesson.procedureSteps?.splice(idx, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // --- BENEFITS ---

  addBenefit() {
    if (!this.currentCourse.benefits) this.currentCourse.benefits = [];
    this.currentCourse.benefits.push({ title: 'Novo Benefício', description: 'Descrição' });
  }

  removeBenefit(index: number) {
    this.currentCourse.benefits?.splice(index, 1);
  }

  handleUpload = (item: any) => {
    this.isUploadingImage = true;
    const file = item.file as File;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentCourse.thumbnailUrl = e.target.result;
      this.currentCourse.imageUrl = e.target.result; // Ensure both are updated
      this.isUploadingImage = false;
      item.onSuccess({}, item.file, event);
      this.message.success('Imagem carregada');
    };
    reader.onerror = () => {
      this.isUploadingImage = false;
      this.message.error('Erro ao ler arquivo');
    };
    reader.readAsDataURL(file);
    return new Subscription();
  };

  handleVideoUpload = (item: any) => {
    if (!this.selectedLesson) return new Subscription();
    this.isUploadingVideo = true;

    const file = item.file as File;
    // For demo, we'll create a blob URL. In production, you'd upload to a server.
    const videoUrl = URL.createObjectURL(file);
    this.selectedLesson.videoUrl = videoUrl;

    setTimeout(() => {
      this.isUploadingVideo = false;
      item.onSuccess({}, item.file, event);
      this.message.success(`Vídeo "${file.name}" carregado com sucesso!`);
    }, 1500); // Simulate processing delay for visual feedback

    return new Subscription();
  };

  getFullUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }
}
