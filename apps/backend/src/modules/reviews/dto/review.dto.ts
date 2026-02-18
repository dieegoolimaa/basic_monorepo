import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Course ID to review' })
    @IsMongoId()
    courseId: string;

    @ApiProperty({ example: 5, description: 'Rating from 1 to 5 stars', minimum: 1, maximum: 5 })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        example: 'Excelente curso! Aprendi muito.',
        description: 'Review comment/text',
        required: false
    })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiProperty({
        example: false,
        description: 'Whether the review should be anonymous',
        required: false,
        default: false
    })
    @IsOptional()
    @IsBoolean()
    isAnonymous?: boolean;
}

export class UpdateReviewDto {
    @ApiProperty({ example: 4, description: 'Updated rating from 1 to 5 stars', minimum: 1, maximum: 5, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiProperty({
        example: 'Atualizando minha avaliação...',
        description: 'Updated review comment',
        required: false
    })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiProperty({
        example: true,
        description: 'Whether the review should be anonymous',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isAnonymous?: boolean;
}
