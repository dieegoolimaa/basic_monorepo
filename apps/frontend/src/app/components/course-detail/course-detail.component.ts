import { Component, inject, OnInit, signal, computed, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private el = inject(ElementRef);

  course = signal<Course | null>(null);
  isLoggedIn = this.authService.isAuthenticated;

  hasAccess = computed(() => {
    const c = this.course();
    if (!c) return false;
    return this.authService.canAccessCourse(c._id);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourseById(id).subscribe(c => {
        this.course.set(c);
        setTimeout(() => this.initScrollReveal(), 100);
      });
    }
  }

  ngAfterViewInit() {
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = this.el.nativeElement.querySelectorAll('.reveal');
    elements.forEach((el: Element) => observer.observe(el));
  }

  startCourse(courseId: string) {
    this.router.navigate(['/player', courseId]);
  }

  getTotalDuration(course: Course): string {
    let totalMinutes = 0;
    course.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (lesson.duration) {
          const parts = lesson.duration.split(':');
          if (parts.length === 2) {
            totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
        }
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
  }

  getTotalLessons(course: Course): number {
    return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
  }

  getFullUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }
}
