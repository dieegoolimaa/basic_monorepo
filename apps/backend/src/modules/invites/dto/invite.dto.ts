import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInviteDto {
    @ApiProperty({ example: 'student@example.com', description: 'Email address of the invitee' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'],
        description: 'Array of course IDs the user will have access to',
        required: false,
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    courseIds?: string[];
}

export class ValidateInviteDto {
    @ApiProperty({ example: 'INV-ABC123', description: 'Invite code to validate' })
    @IsNotEmpty()
    @IsString()
    code: string;
}
