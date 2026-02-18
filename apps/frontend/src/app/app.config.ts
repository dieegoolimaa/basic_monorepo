import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import {
  ArrowRightOutline, SafetyCertificateOutline, ClockCircleOutline, CheckCircleOutline,
  InboxOutline, PlayCircleOutline, DeleteOutline, CheckOutline, PlusOutline, EditOutline,
  PictureOutline, ReadOutline, ArrowLeftOutline, UserOutline, CloudUploadOutline,
  MailOutline, LockOutline, AppstoreOutline, QuestionCircleOutline, FileTextOutline,
  ExperimentOutline, FileOutline, SaveOutline, CameraOutline, FormOutline, CloseOutline,
  LoadingOutline, EyeOutline, EyeInvisibleOutline, InfoCircleOutline,
  UserAddOutline, StopOutline, TeamOutline, SendOutline, SyncOutline, SearchOutline,
  SettingOutline, BellOutline, StarOutline, StarFill, HeartOutline, DownloadOutline
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

// Register Portuguese locale for Angular pipes
registerLocaleData(pt);

const icons = [
  ArrowRightOutline, SafetyCertificateOutline, ClockCircleOutline, CheckCircleOutline,
  InboxOutline, PlayCircleOutline, DeleteOutline, CheckOutline, PlusOutline, EditOutline,
  PictureOutline, ReadOutline, ArrowLeftOutline, UserOutline, CloudUploadOutline,
  MailOutline, LockOutline, AppstoreOutline, QuestionCircleOutline, FileTextOutline,
  ExperimentOutline, FileOutline, SaveOutline, CameraOutline, FormOutline, CloseOutline,
  LoadingOutline, EyeOutline, EyeInvisibleOutline, InfoCircleOutline,
  UserAddOutline, StopOutline, TeamOutline, SendOutline, SyncOutline, SearchOutline,
  SettingOutline, BellOutline, StarOutline, StarFill, HeartOutline, DownloadOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loadingInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    provideNzIcons(icons),
    // Ng-Zorro i18n - Portuguese Brazil
    { provide: NZ_I18N, useValue: pt_BR }
  ]
};
