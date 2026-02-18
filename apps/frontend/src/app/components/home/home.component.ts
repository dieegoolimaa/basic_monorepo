import { Component, inject, OnInit, signal, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeContentService } from '../../services/home-content.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private homeContentService = inject(HomeContentService);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private el = inject(ElementRef);

  settings = this.homeContentService.settings;

  getFullUrl(url: string | undefined): string {
    if (!url) return 'assets/hero-placeholder.jpg';
    if (url.startsWith('data:')) return url; // Handle base64 data URLs
    if (url.startsWith('http')) return url;
    if (url.startsWith('assets') || url.startsWith('/assets')) return url;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }

  featuredCourses = signal<Course[]>([]);
  isLoadingCourses = signal(false);
  shouldShowNav = signal(false);

  ngOnInit() {
    this.homeContentService.loadSettings();
    this.loadFeaturedCourses();
  }

  ngAfterViewInit() {
    this.initScrollReveal();
    setTimeout(() => this.checkShowNav(), 500);
  }

  private checkShowNav() {
    const el = this.el.nativeElement.querySelector('.showcase-wrapper');
    if (el) {
      this.shouldShowNav.set(el.scrollWidth > el.clientWidth);
    }
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, we can stop observing this element
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

  loadFeaturedCourses() {
    this.isLoadingCourses.set(true);
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        console.log('Courses loaded:', courses);
        let filtered = courses.filter(c => c.isActive);
        if (filtered.length === 0 && courses.length > 0) {
          filtered = courses; // Fallback if none are marked active but we have data
        }
        this.featuredCourses.set(filtered.slice(0, 6));
        this.isLoadingCourses.set(false);
        setTimeout(() => {
          this.initScrollReveal();
          this.checkShowNav();
        }, 300);
      },
      error: () => {
        this.isLoadingCourses.set(false);
      }
    });
  }

  navigateToCourses() {
    this.router.navigate(['/formacoes']);
  }

  prevSlide() {
    const el = this.el.nativeElement.querySelector('.showcase-wrapper');
    if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
  }

  nextSlide() {
    const el = this.el.nativeElement.querySelector('.showcase-wrapper');
    if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
  }
}
