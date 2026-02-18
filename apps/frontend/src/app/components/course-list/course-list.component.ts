import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CourseService } from '../../services/course.service';
import { HomeContentService } from '../../services/home-content.service';
import { Course } from '../../models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private homeContentService = inject(HomeContentService);
  private router = inject(Router);

  settings = this.homeContentService.settings;
  courses = signal<Course[]>([]);

  ngOnInit() {
    this.homeContentService.loadSettings();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe(data => {
      this.courses.set(data.filter(c => c.isActive));
    });
  }

  viewCourse(id: string) {
    this.router.navigate(['/formacoes', id]);
  }
}
