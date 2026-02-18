import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HomeContentService } from '../../services/home-content.service';
import { UploadService } from '../../services/upload.service';
import { ReviewService, AdminReview } from '../../services/review.service';
import { SiteSettings } from '../../models';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-home-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule,
    NzMessageModule,
    NzInputModule,
    NzSwitchModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzToolTipModule,
    NzTabsModule,
    NzCardModule,
    NzDividerModule
  ],
  templateUrl: './admin-home-manager.component.html',
  styleUrl: './admin-home-manager.component.scss'
})
export class AdminHomeManagerComponent implements OnInit {
  private homeContentService = inject(HomeContentService);
  private uploadService = inject(UploadService);
  private reviewService = inject(ReviewService);
  private message = inject(NzMessageService);

  // Site Settings
  settingsForm: Partial<SiteSettings> = {
    aboutTag: '',
    aboutTitle: '',
    aboutParagraph1: '',
    aboutParagraph2: '',
    aboutImageUrl: '',
    welcomeImageUrl: '',
    experienceYears: '',
    studentsFormed: '',
    averageRating: '',
    founderName: '',
    coursesTag: '',
    coursesTitle: '',
    carouselButtonText: '',
    philosophyTitle1: '',
    philosophyDesc1: '',
    philosophyTitle2: '',
    philosophyDesc2: '',
    philosophyTitle3: '',
    philosophyDesc3: ''
  };
  isSavingSettings = false;
  isLoadingSettings = false;
  isUploadingAbout = false;
  isUploadingWelcome = false;

  // Reviews
  reviews: AdminReview[] = [];
  isLoadingReviews = false;

  ngOnInit() {
    this.loadSettings();
    this.loadReviews();
  }

  loadReviews() {
    this.isLoadingReviews = true;
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        // Sanitize data to avoid template errors if relations are missing
        this.reviews = reviews.map(r => ({
          ...r,
          courseId: r.courseId || { title: 'Curso removido' },
          userId: r.userId || { name: 'Usuário', email: '' }
        }));
        this.isLoadingReviews = false;
      },
      error: () => {
        this.isLoadingReviews = false;
      }
    });
  }

  getFullUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }

  // ========== SITE SETTINGS ==========

  loadSettings() {
    this.isLoadingSettings = true;
    this.homeContentService.getSettings().subscribe({
      next: (settings) => {
        this.settingsForm = { ...settings };
        this.isLoadingSettings = false;
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.isLoadingSettings = false;
      }
    });
  }

  handleAboutImageUpload = (item: NzUploadXHRArgs) => {
    const file = item.file as any;

    if (!this.uploadService.isValidImage(file)) {
      this.message.error('Formato de imagem inválido');
      if (item.onError) {
        item.onError(new Error('Invalid image'), item.file);
      }
      return new Subscription();
    }

    this.isUploadingAbout = true;
    this.uploadService.uploadFile(file, 'image').subscribe({
      next: (response) => {
        this.settingsForm.aboutImageUrl = response.url;
        this.isUploadingAbout = false;
        if (item.onSuccess) {
          item.onSuccess(response, item.file, new Event(''));
        }
        this.message.success('Imagem carregada!');
      },
      error: (err) => {
        this.isUploadingAbout = false;
        if (item.onError) {
          item.onError(err, item.file);
        }
        this.message.error('Erro ao carregar imagem');
      }
    });

    return new Subscription();
  };

  handleWelcomeImageUpload = (item: NzUploadXHRArgs) => {
    const file = item.file as any;

    if (!this.uploadService.isValidImage(file)) {
      this.message.error('Formato de imagem inválido');
      if (item.onError) {
        item.onError(new Error('Invalid image'), item.file);
      }
      return new Subscription();
    }

    this.isUploadingWelcome = true;
    this.uploadService.uploadFile(file, 'image').subscribe({
      next: (response) => {
        this.settingsForm.welcomeImageUrl = response.url;
        this.isUploadingWelcome = false;
        if (item.onSuccess) {
          item.onSuccess(response, item.file, new Event(''));
        }
        this.message.success('Imagem de boas-vindas carregada!');
      },
      error: (err) => {
        this.isUploadingWelcome = false;
        if (item.onError) {
          item.onError(err, item.file);
        }
        this.message.error('Erro ao carregar imagem de boas-vindas');
      }
    });

    return new Subscription();
  };

  saveSettings() {
    this.isSavingSettings = true;
    this.homeContentService.updateSettings(this.settingsForm).subscribe({
      next: () => {
        this.message.success('Configurações salvas com sucesso!');
        this.isSavingSettings = false;
      },
      error: (err) => {
        console.error('Error saving settings:', err);
        this.message.error('Erro ao salvar configurações');
        this.isSavingSettings = false;
      }
    });
  }
}
