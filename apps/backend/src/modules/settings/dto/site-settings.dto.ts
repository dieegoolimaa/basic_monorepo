import { IsString, IsOptional } from 'class-validator';

export class UpdateSiteSettingsDto {
    @IsString()
    @IsOptional()
    welcomeImageUrl?: string;

    // About Section
    @IsString()
    @IsOptional()
    aboutTag?: string;

    @IsString()
    @IsOptional()
    aboutTitle?: string;

    @IsString()
    @IsOptional()
    aboutParagraph1?: string;

    @IsString()
    @IsOptional()
    aboutParagraph2?: string;

    @IsString()
    @IsOptional()
    aboutImageUrl?: string;

    // Stats
    @IsString()
    @IsOptional()
    experienceYears?: string;

    @IsString()
    @IsOptional()
    studentsFormed?: string;

    @IsString()
    @IsOptional()
    averageRating?: string;

    // Founder Info
    @IsString()
    @IsOptional()
    founderName?: string;

    // Courses Section
    @IsString()
    @IsOptional()
    coursesTag?: string;

    @IsString()
    @IsOptional()
    coursesTitle?: string;

    @IsString()
    @IsOptional()
    carouselButtonText?: string;

    // Philosophy Section
    @IsString()
    @IsOptional()
    philosophyTitle1?: string;
    @IsString()
    @IsOptional()
    philosophyDesc1?: string;

    @IsString()
    @IsOptional()
    philosophyTitle2?: string;
    @IsString()
    @IsOptional()
    philosophyDesc2?: string;

    @IsString()
    @IsOptional()
    philosophyTitle3?: string;
    @IsString()
    @IsOptional()
    philosophyDesc3?: string;


}
