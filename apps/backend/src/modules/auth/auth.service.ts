import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InvitesService } from '../invites/invites.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private invitesService: InvitesService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { name, email, password, inviteCode, phone, address, city } = registerDto;

        // Check if user already exists
        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            throw new BadRequestException('Email já cadastrado');
        }

        // Validate invite code
        const invite = await this.invitesService.validateCode(inviteCode, email);
        if (!invite) {
            throw new BadRequestException('Código de convite inválido ou expirado');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.usersService.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            role: UserRole.STUDENT,
            inviteCode,
            enrolledCourses: invite.courseIds,
        });

        // Mark invite as used
        await this.invitesService.markAsUsed(inviteCode, user._id.toString());

        // Generate token
        const payload = { userId: user._id, email: user.email, role: user.role };
        return {
            user: this.sanitizeUser(user),
            token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Conta desativada');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { userId: user._id, email: user.email, role: user.role };
        return {
            user: this.sanitizeUser(user),
            token: this.jwtService.sign(payload),
        };
    }

    async validateInviteCode(code: string) {
        const invite = await this.invitesService.findByCode(code);
        if (!invite || invite.status !== 'pending') {
            return { valid: false };
        }

        return {
            valid: true,
            email: invite.email,
            courseIds: invite.courseIds,
        };
    }

    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(email);

        // Silently return if user not found (prevent email enumeration)
        if (!user) return;

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save token to user
        await this.usersService.setPasswordResetToken(
            user._id.toString(),
            resetToken,
            resetExpires
        );

        // Send email
        await this.mailService.sendPasswordResetEmail(
            user.email,
            user.name,
            resetToken
        );
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            throw new BadRequestException('Token inválido ou expirado');
        }

        if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
            throw new BadRequestException('Token expirado. Solicite um novo link.');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await this.usersService.updatePasswordAndClearToken(
            user._id.toString(),
            hashedPassword
        );
    }

    private sanitizeUser(user: any) {
        const { password, passwordResetToken, passwordResetExpires, ...result } = user.toObject();
        return result;
    }
}

