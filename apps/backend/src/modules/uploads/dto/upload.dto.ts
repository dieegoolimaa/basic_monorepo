import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum FileType {
    IMAGE = 'image',
    VIDEO = 'video',
}

export class UploadFileDto {
    @ApiProperty({
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
        description: 'Base64 encoded file with data URI prefix',
    })
    @IsNotEmpty()
    @IsString()
    base64: string;

    @ApiProperty({
        example: 'course-thumbnail.jpg',
        description: 'Original filename',
    })
    @IsNotEmpty()
    @IsString()
    filename: string;

    @ApiProperty({
        example: 'image',
        description: 'File type (image or video)',
        enum: FileType,
    })
    @IsEnum(FileType)
    type: FileType;
}
