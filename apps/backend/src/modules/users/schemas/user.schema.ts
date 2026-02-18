import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
    role: UserRole;

    @Prop()
    phone?: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    avatar?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    mustChangePassword: boolean;

    @Prop()
    passwordResetToken?: string;

    @Prop()
    passwordResetExpires?: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }] })
    enrolledCourses: Types.ObjectId[];

    @Prop()
    inviteCode?: string;

    @Prop({ type: Map, of: Number, default: {} })
    courseProgress: Map<string, number>;

    @Prop({ type: [String], default: [] })
    completedLessons: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
