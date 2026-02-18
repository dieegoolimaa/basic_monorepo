import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invite, InviteDocument, InviteStatus } from './schemas/invite.schema';
import { CreateInviteDto } from './dto/invite.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvitesService {
    private readonly logger = new Logger(InvitesService.name);

    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
        private mailService: MailService,
    ) { }

    async create(adminUserId: string, createInviteDto: CreateInviteDto, courseNames: string[] = []): Promise<InviteDocument> {
        const { email, courseIds } = createInviteDto;

        // Check if there's already a pending invite for this email
        const existing = await this.inviteModel.findOne({
            email: email.toLowerCase(),
            status: InviteStatus.PENDING,
        }).exec();

        if (existing) {
            throw new BadRequestException('Já existe um convite pendente para este email');
        }

        // Generate unique code
        const code = this.generateInviteCode();

        // Set expiration to 30 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const invite = new this.inviteModel({
            code,
            email: email.toLowerCase(),
            courseIds: courseIds?.map(id => new Types.ObjectId(id)) || [],
            createdBy: new Types.ObjectId(adminUserId),
            expiresAt,
        });

        const savedInvite = await invite.save();

        // Send email with invite code
        try {
            await this.mailService.sendInviteEmail(email, code, courseNames);
        } catch (error) {
            this.logger.error('Failed to send invite email', error);
            // Don't fail the invite creation if email fails
        }

        return savedInvite;
    }

    async findByCode(code: string): Promise<InviteDocument | null> {
        return this.inviteModel.findOne({ code }).populate('courseIds').exec();
    }

    async validateCode(code: string, email: string): Promise<InviteDocument | null> {
        const invite = await this.inviteModel.findOne({
            code,
            email: email.toLowerCase(),
            status: InviteStatus.PENDING,
        }).exec();

        if (!invite) return null;

        // Check if expired
        if (invite.expiresAt && new Date() > invite.expiresAt) {
            invite.status = InviteStatus.EXPIRED;
            await invite.save();
            return null;
        }

        return invite;
    }

    async markAsUsed(code: string, userId: string): Promise<InviteDocument> {
        const invite = await this.inviteModel.findOneAndUpdate(
            { code },
            {
                status: InviteStatus.USED,
                usedBy: new Types.ObjectId(userId),
                usedAt: new Date(),
            },
            { new: true },
        ).exec();

        if (!invite) throw new NotFoundException('Convite não encontrado');
        return invite;
    }

    async cancel(code: string): Promise<InviteDocument> {
        const invite = await this.inviteModel.findOneAndUpdate(
            { code, status: InviteStatus.PENDING },
            { status: InviteStatus.CANCELLED },
            { new: true },
        ).exec();

        if (!invite) throw new NotFoundException('Convite não encontrado ou já utilizado');
        return invite;
    }

    async findPending(): Promise<InviteDocument[]> {
        return this.inviteModel
            .find({ status: InviteStatus.PENDING })
            .populate('courseIds', 'title')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findAll(): Promise<InviteDocument[]> {
        return this.inviteModel
            .find()
            .populate('courseIds', 'title')
            .populate('createdBy', 'name email')
            .populate('usedBy', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async resendInvite(code: string): Promise<{ success: boolean; message: string }> {
        const invite = await this.inviteModel
            .findOne({ code, status: InviteStatus.PENDING })
            .populate('courseIds', 'title')
            .exec();

        if (!invite) throw new NotFoundException('Convite não encontrado ou já utilizado');

        // Get course names
        const courseNames = (invite.courseIds as any[]).map(c => c.title || 'Curso');

        // Send email
        const sent = await this.mailService.sendInviteEmail(invite.email, code, courseNames);

        return {
            success: sent,
            message: sent ? `Convite reenviado para ${invite.email}` : 'Falha ao enviar email',
        };
    }

    private generateInviteCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BASIC-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
}
