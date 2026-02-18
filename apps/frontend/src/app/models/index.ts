export interface Course {
    _id: string;
    title: string;
    subtitle: string;
    description?: string;
    instructor: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    modules: CourseModule[];
    benefits?: CourseBenefit[];
    isActive: boolean;
    averageRating: number;
    totalReviews: number;
    totalStudents: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CourseBenefit {
    title: string;
    description: string;
}

export interface CourseModule {
    id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
    procedureSteps?: ProcedureStep[];
    textContent?: string;
    supplementaryMaterial?: string[];
    contentType?: 'video' | 'text' | 'mixed' | 'quiz';
    completed?: boolean;
    quiz?: {
        questions: QuizQuestion[];
        minPassScore: number;
    };
}

export interface ProcedureStep {
    step: number;
    description: string;
    timeOffset?: string;
    tips?: string[];
    isCompleted?: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    role: 'student' | 'admin';
    isActive: boolean;
    mustChangePassword?: boolean;
    enrolledCourses?: string[];
    completedLessons?: string[];
    courseProgress?: { [courseId: string]: number };
    avatar?: string;
    inviteCode?: string;
    createdAt?: Date;
    progress?: { [courseId: string]: CourseProgress };
}

export interface CourseProgress {
    completedLessons: string[];
    quizScores: { [lessonId: string]: number };
}

export interface HomeBanner {
    _id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    isActive: boolean;
    createdAt?: Date;
}

// Invite code for user registration
export interface InviteCode {
    _id: string;
    code: string;
    email: string;
    courseIds: string[];
    status: 'pending' | 'used' | 'cancelled' | 'expired';
    createdBy?: string;
    usedBy?: string;
    usedAt?: Date;
    expiresAt?: Date;
    createdAt?: Date;
}

export interface Review {
    _id: string;
    userId: string | { _id: string; name: string; avatar?: string };
    courseId: string;
    rating: number;
    comment?: string;
    isAnonymous: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface CourseStats {
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
}

export interface SiteSettings {
    _id?: string;
    welcomeImageUrl: string;
    aboutTag: string;
    aboutTitle: string;
    aboutParagraph1: string;
    aboutParagraph2: string;
    aboutImageUrl: string;
    experienceYears: string;
    studentsFormed: string;
    averageRating: string;
    founderName: string;
    coursesTag: string;
    coursesTitle: string;
    carouselButtonText: string;
    philosophyTitle1: string;
    philosophyDesc1: string;
    philosophyTitle2: string;
    philosophyDesc2: string;
    philosophyTitle3: string;
    philosophyDesc3: string;
    heroTagLeft: string;
    heroTagRight: string;
    heroTitle: string;
}
