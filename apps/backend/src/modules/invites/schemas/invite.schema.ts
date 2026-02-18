import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InviteDocument = Invite & Document;

export enum InviteStatus {
    PENDING = 'pending',
    USED = 'used',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Invite {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true, lowercase: true })
    email: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
    courseIds: Types.ObjectId[];

    @Prop({ type: String, enum: InviteStatus, default: InviteStatus.PENDING })
    status: InviteStatus;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    usedBy?: Types.ObjectId;

    @Prop()
    usedAt?: Date;

    @Prop()
    expiresAt?: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
