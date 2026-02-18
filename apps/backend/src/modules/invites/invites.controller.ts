import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateInviteDto } from './dto/invite.dto';

@ApiTags('invites')
@Controller('invites')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('JWT-auth')
export class InvitesController {
    constructor(private readonly invitesService: InvitesService) { }

    @Post()
    @ApiOperation({ summary: 'Create invite code (Admin)', description: 'Generates a new invite code for user registration' })
    @ApiResponse({ status: 201, description: 'Invite code created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async create(@Request() req: any, @Body() createInviteDto: CreateInviteDto) {
        return this.invitesService.create(req.user.userId, createInviteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all invite codes (Admin)', description: 'Returns all invite codes including used and pending' })
    @ApiResponse({ status: 200, description: 'List of all invite codes' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async findAll() {
        return this.invitesService.findAll();
    }

    @Get('pending')
    @ApiOperation({ summary: 'Get pending invites (Admin)', description: 'Returns all unused invite codes' })
    @ApiResponse({ status: 200, description: 'List of pending invite codes' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async findPending() {
        return this.invitesService.findPending();
    }

    @Delete(':code')
    @ApiOperation({ summary: 'Cancel invite code (Admin)', description: 'Cancels/deletes an invite code' })
    @ApiResponse({ status: 200, description: 'Invite code cancelled successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Invite code not found' })
    async cancel(@Param('code') code: string) {
        return this.invitesService.cancel(code);
    }

    @Post(':code/resend')
    @ApiOperation({ summary: 'Resend invite email (Admin)', description: 'Resends the invitation email for a specific code' })
    @ApiResponse({ status: 200, description: 'Invite email resent successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Invite code not found' })
    async resend(@Param('code') code: string) {
        return this.invitesService.resendInvite(code);
    }
}
