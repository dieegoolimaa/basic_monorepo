import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create review', description: 'Creates a new review for a course' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'User already reviewed this course' })
    async create(@Request() req: any, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(req.user.userId, createReviewDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update review', description: 'Updates an existing review (only by the review owner)' })
    @ApiResponse({ status: 200, description: 'Review updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the review owner' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
    ) {
        return this.reviewsService.update(id, req.user.userId, updateReviewDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete review', description: 'Deletes a review (only by the review owner)' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the review owner' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    async delete(@Request() req: any, @Param('id') id: string) {
        return this.reviewsService.delete(id, req.user.userId);
    }

    @Get('course/:courseId')
    @ApiOperation({ summary: 'Get course reviews', description: 'Returns all reviews for a specific course' })
    @ApiResponse({ status: 200, description: 'List of course reviews' })
    async findByCourse(@Param('courseId') courseId: string) {
        return this.reviewsService.findByCourse(courseId);
    }

    @Get('course/:courseId/stats')
    @ApiOperation({ summary: 'Get course review stats', description: 'Returns review statistics for a course (average rating, count, etc.)' })
    @ApiResponse({ status: 200, description: 'Course review statistics' })
    async getCourseStats(@Param('courseId') courseId: string) {
        return this.reviewsService.getCourseStats(courseId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get my reviews', description: 'Returns all reviews created by the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of user reviews' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findMyReviews(@Request() req: any) {
        return this.reviewsService.findByUser(req.user.userId);
    }

    @Get('me/course/:courseId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get my review for course', description: 'Returns the user review for a specific course' })
    @ApiResponse({ status: 200, description: 'User review for the course' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    async getMyReviewForCourse(@Request() req: any, @Param('courseId') courseId: string) {
        return this.reviewsService.getUserReviewForCourse(req.user.userId, courseId);
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all reviews (Admin)', description: 'Returns all reviews with user and course info for admin dashboard' })
    @ApiResponse({ status: 200, description: 'List of all reviews' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async getAllReviews() {
        return this.reviewsService.findAllWithDetails();
    }
}

