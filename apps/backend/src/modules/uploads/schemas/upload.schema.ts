import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Upload extends Document {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    mimeType: string;

    @Prop({ required: true })
    base64Data: string; // Armazena o base64 sem o prefixo data:...

    @Prop({ required: true })
    size: number; // Tamanho em bytes

    @Prop({ required: true, enum: ['image', 'video'] })
    type: string;

    @Prop()
    uploadedBy: string; // User ID

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
