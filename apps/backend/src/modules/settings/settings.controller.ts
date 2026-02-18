import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSiteSettingsDto } from './dto/site-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    /**
     * GET /api/settings - Public: Get site settings
     */
    @Get()
    @ApiOperation({ summary: 'Get site settings', description: 'Returns all site settings for the about section and stats' })
    @ApiResponse({ status: 200, description: 'Site settings retrieved successfully' })
    async getSettings() {
        return this.settingsService.getSettings();
    }

    /**
     * PUT /api/settings - Admin: Update site settings
     */
    @Put()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update site settings (Admin)', description: 'Admin endpoint to update site settings' })
    @ApiResponse({ status: 200, description: 'Settings updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async updateSettings(@Body() updateDto: UpdateSiteSettingsDto) {
        return this.settingsService.updateSettings(updateDto);
    }

    /**
     * PUT /api/settings/reset - Admin: Reset settings to defaults
     */
    @Put('reset')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Reset site settings (Admin)', description: 'Resets all settings to their default values' })
    @ApiResponse({ status: 200, description: 'Settings reset successfully' })
    async resetSettings() {
        return this.settingsService.resetSettings();
    }
}
