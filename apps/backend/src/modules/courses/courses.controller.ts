import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Course } from './schemas/course.schema';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all courses', description: 'Returns all available courses for public viewing' })
    @ApiResponse({ status: 200, description: 'List of all courses' })
    async findAll() {
        return this.coursesService.findAll();
    }

    @Get('with-ratings')
    @ApiOperation({ summary: 'Get courses with ratings', description: 'Returns all courses including their average ratings and review counts' })
    @ApiResponse({ status: 200, description: 'List of courses with rating information' })
    async getCoursesWithRatings() {
        return this.coursesService.getCoursesWithRatings();
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all courses (Admin)', description: 'Admin endpoint to retrieve all courses with full details' })
    @ApiResponse({ status: 200, description: 'List of all courses with admin details' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async findAllAdmin() {
        return this.coursesService.findAllAdmin();
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create new course', description: 'Admin endpoint to create a new course' })
    @ApiResponse({ status: 201, description: 'Course successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async create(@Body() courseData: Partial<Course>) {
        return this.coursesService.create(courseData);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update course', description: 'Admin endpoint to update an existing course' })
    @ApiResponse({ status: 200, description: 'Course successfully updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    async update(@Param('id') id: string, @Body() courseData: Partial<Course>) {
        return this.coursesService.update(id, courseData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete course', description: 'Admin endpoint to delete a course' })
    @ApiResponse({ status: 200, description: 'Course successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    async delete(@Param('id') id: string) {
        return this.coursesService.delete(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get course by ID', description: 'Returns detailed information about a specific course' })
    @ApiResponse({ status: 200, description: 'Course details' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    async findById(@Param('id') id: string) {
        return this.coursesService.findById(id);
    }
}
