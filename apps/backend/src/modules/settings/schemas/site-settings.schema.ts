import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true })
export class SiteSettings {
    @Prop({ default: 'default' })
    key: string; // Unique key for settings (only one document with key 'default')

    // Hero Section
    @Prop({ default: '' })
    welcomeImageUrl: string;

    // About Section
    @Prop({ default: 'Sobre a Basic Studio' })
    aboutTag: string;

    @Prop({ default: 'Formando Nail Artists em Portugal' })
    aboutTitle: string;

    @Prop({ default: 'A Basic nasceu do desejo de elevar o nível profissional do mercado de unhas. Nossa fundadora, Cris Souza, desenvolveu uma metodologia única que une técnica precisa, saúde das unhas e arte de alto nível.' })
    aboutParagraph1: string;

    @Prop({ default: 'Nossos cursos não ensinam apenas a "fazer unhas". Ensinamos você a construir uma carreira sólida, conquistar clientes de alto padrão e se destacar em um mercado competitivo.' })
    aboutParagraph2: string;

    @Prop({ default: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80' })
    aboutImageUrl: string;

    // Stats
    @Prop({ default: '10+' })
    experienceYears: string;

    @Prop({ default: '5k+' })
    studentsFormed: string;

    @Prop({ default: '4.9' })
    averageRating: string;

    // Founder Info
    @Prop({ default: 'Cris Souza' })
    founderName: string;

    // Courses Section
    @Prop({ default: 'MASTERCLASS SERIES' })
    coursesTag: string;

    @Prop({ default: 'Formações de Elite' })
    coursesTitle: string;

    @Prop({ default: 'DESCUBRA O MODO BASIC' })
    carouselButtonText: string;

    // Philosophy Section
    @Prop({ default: 'EXCLUSIVIDADE' })
    philosophyTitle1: string;
    @Prop({ default: 'Metodologias únicas desenhadas para elevar o seu padrão profissional ao topo do mercado.' })
    philosophyDesc1: string;

    @Prop({ default: 'MAESTRIA' })
    philosophyTitle2: string;
    @Prop({ default: 'O domínio técnico aliado ao olhar artístico que diferencia uma profissional comum de uma referência.' })
    philosophyDesc2: string;

    @Prop({ default: 'LEGADO' })
    philosophyTitle3: string;
    @Prop({ default: 'Não formamos apenas técnicos, construímos carreiras sólidas e marcas pessoais inesquecíveis.' })
    philosophyDesc3: string;
    @Prop({ default: 'MENTORIA' })
    heroTagLeft: string;

    @Prop({ default: 'CRIS SOUZA' })
    heroTagRight: string;

    @Prop({ default: 'BEM VINDA' })
    heroTitle: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
