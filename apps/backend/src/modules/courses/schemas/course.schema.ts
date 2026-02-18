import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class ProcedureStep {
    @Prop({ required: true })
    step: number;

    @Prop({ required: true })
    description: string;

    @Prop()
    timeOffset?: string;

    @Prop({ type: [String], default: [] })
    tips?: string[];
}

@Schema()
export class QuizQuestion {
    @Prop()
    id: string;

    @Prop()
    question: string;

    @Prop([String])
    options: string[];

    @Prop()
    correctOptionIndex: number;
}

@Schema()
export class Quiz {
    @Prop({ type: [QuizQuestion], default: [] })
    questions: QuizQuestion[];

    @Prop({ default: 70 })
    minPassScore: number;
}

@Schema()
export class Lesson {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop()
    contentType?: string;

    @Prop()
    videoUrl?: string;

    @Prop()
    thumbnailUrl?: string;

    @Prop()
    duration?: string;

    @Prop({ type: [ProcedureStep], default: [] })
    procedureSteps: ProcedureStep[];

    @Prop({ type: Quiz })
    quiz?: Quiz;

    @Prop()
    textContent?: string;

    @Prop({ type: [String], default: [] })
    supplementaryMaterial?: string[];
}

@Schema()
export class Module {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ type: [Lesson], default: [] })
    lessons: Lesson[];
}

@Schema()
export class Benefit {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;
}

@Schema({ timestamps: true })
export class Course {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    subtitle: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    instructor: string;

    @Prop()
    imageUrl?: string;

    @Prop()
    thumbnailUrl?: string;

    @Prop({ type: [Module], default: [] })
    modules: Module[];

    @Prop({ type: [Benefit], default: [] })
    benefits: Benefit[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    totalReviews: number;

    @Prop({ default: 0 })
    totalStudents: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
