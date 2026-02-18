import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request, Response } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Upload file',
        description: 'Upload an image or video as base64. Max size: 5MB for images, 50MB for videos',
    })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Invalid file format or size' })
    @ApiResponse({ status: 413, description: 'File too large' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async uploadFile(@Body() uploadDto: UploadFileDto, @Request() req: any) {
        return this.uploadsService.uploadFile(uploadDto, req.user?.userId);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get file by ID',
        description: 'Retrieve a file (image or video) by its ID',
    })
    @ApiResponse({ status: 200, description: 'File retrieved successfully' })
    @ApiResponse({ status: 404, description: 'File not found' })
    async getFile(@Param('id') id: string, @Response() res: any) {
        const fileData = await this.uploadsService.getFileBuffer(id);
        res.set('Content-Type', fileData.mimeType);
        return res.send(fileData.buffer);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Delete file',
        description: 'Delete an uploaded file by its ID',
    })
    @ApiResponse({ status: 200, description: 'File deleted successfully' })
    @ApiResponse({ status: 404, description: 'File not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteFile(@Param('id') id: string, @Request() req: any) {
        return this.uploadsService.deleteFile(id, req.user?.userId);
    }
}
