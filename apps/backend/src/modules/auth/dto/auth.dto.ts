import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'INV-ABC123', description: 'Invite code received by email' })
    @IsNotEmpty()
    @IsString()
    inviteCode: string;

    @ApiProperty({ example: '+1234567890', description: 'User phone number', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: '123 Main St', description: 'User address', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: 'New York', description: 'User city', required: false })
    @IsOptional()
    @IsString()
    city?: string;
}

export class LoginDto {
    @ApiProperty({ example: 'john@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
