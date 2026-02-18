import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    ) { }

    async findAll(): Promise<CourseDocument[]> {
        return this.courseModel.find({ isActive: true }).exec();
    }

    async findAllAdmin(): Promise<CourseDocument[]> {
        return this.courseModel.find().exec();
    }

    async findById(id: string): Promise<CourseDocument> {
        const course = await this.courseModel.findById(id).exec();
        if (!course) throw new NotFoundException('Curso não encontrado');
        return course;
    }

    async create(courseData: Partial<Course>): Promise<CourseDocument> {
        const course = new this.courseModel(courseData);
        return course.save();
    }

    async update(id: string, courseData: Partial<Course>): Promise<CourseDocument> {
        const course = await this.courseModel.findByIdAndUpdate(id, courseData, { new: true }).exec();
        if (!course) throw new NotFoundException('Curso não encontrado');
        return course;
    }

    async delete(id: string): Promise<void> {
        const result = await this.courseModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Curso não encontrado');
    }

    async updateRating(courseId: string, averageRating: number, totalReviews: number): Promise<CourseDocument> {
        const course = await this.courseModel.findByIdAndUpdate(
            courseId,
            { averageRating, totalReviews },
            { new: true },
        ).exec();
        if (!course) throw new NotFoundException('Curso não encontrado');
        return course;
    }

    async incrementStudentCount(courseId: string): Promise<void> {
        await this.courseModel.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } }).exec();
    }

    async getCoursesWithRatings(): Promise<any[]> {
        return this.courseModel
            .find({ isActive: true })
            .select('title subtitle instructor imageUrl averageRating totalReviews totalStudents')
            .exec();
    }
}
