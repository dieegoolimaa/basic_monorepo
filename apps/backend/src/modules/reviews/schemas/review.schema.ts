import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment?: string;

    @Prop({ default: false })
    isAnonymous: boolean;

    @Prop({ default: true })
    isActive: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Add compound index to ensure one review per user per course
ReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
