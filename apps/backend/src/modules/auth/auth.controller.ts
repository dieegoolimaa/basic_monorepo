import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user', description: 'Creates a new user account with invite code validation' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Invalid invite code or validation error' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login', description: 'Authenticates user and returns JWT token' })
    @ApiResponse({ status: 200, description: 'Login successful, returns access token and user data' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('validate-invite')
    @ApiOperation({ summary: 'Validate invite code', description: 'Checks if an invite code is valid and not yet used' })
    @ApiQuery({ name: 'code', required: true, description: 'Invite code to validate' })
    @ApiResponse({ status: 200, description: 'Invite code is valid' })
    @ApiResponse({ status: 404, description: 'Invite code not found or already used' })
    async validateInvite(@Query('code') code: string) {
        return this.authService.validateInviteCode(code);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset', description: 'Sends password reset email if user exists' })
    @ApiResponse({ status: 200, description: 'Reset email sent (or silently ignored if not found)' })
    async forgotPassword(@Body() body: { email: string }) {
        await this.authService.requestPasswordReset(body.email);
        return { message: 'Se o email existir, você receberá um link para redefinir sua senha.' };
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token', description: 'Changes password using reset token from email' })
    @ApiResponse({ status: 200, description: 'Password successfully reset' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
        await this.authService.resetPassword(body.token, body.newPassword);
        return { message: 'Senha redefinida com sucesso.' };
    }
}

