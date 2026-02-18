import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CoursesService } from '../courses/courses.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
        private coursesService: CoursesService,
    ) { }

    async create(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
        const { courseId, rating, comment, isAnonymous } = createReviewDto;

        // Check if user already reviewed this course
        const existing = await this.reviewModel.findOne({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
        }).exec();

        if (existing) {
            throw new BadRequestException('Você já avaliou este curso');
        }

        const review = new this.reviewModel({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
            rating,
            comment,
            isAnonymous,
        });

        const savedReview = await review.save();

        // Update course rating
        await this.updateCourseRating(courseId);

        return savedReview;
    }

    async update(reviewId: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewDocument> {
        const review = await this.reviewModel.findOne({
            _id: new Types.ObjectId(reviewId),
            userId: new Types.ObjectId(userId),
        }).exec();

        if (!review) {
            throw new NotFoundException('Avaliação não encontrada');
        }

        Object.assign(review, updateReviewDto);
        const updatedReview = await review.save();

        // Update course rating
        await this.updateCourseRating(review.courseId.toString());

        return updatedReview;
    }

    async delete(reviewId: string, userId: string): Promise<void> {
        const review = await this.reviewModel.findOneAndDelete({
            _id: new Types.ObjectId(reviewId),
            userId: new Types.ObjectId(userId),
        }).exec();

        if (!review) {
            throw new NotFoundException('Avaliação não encontrada');
        }

        // Update course rating
        await this.updateCourseRating(review.courseId.toString());
    }

    async findByCourse(courseId: string): Promise<ReviewDocument[]> {
        return this.reviewModel
            .find({ courseId: new Types.ObjectId(courseId), isActive: true })
            .populate('userId', 'name avatar')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findByUser(userId: string): Promise<ReviewDocument[]> {
        return this.reviewModel
            .find({ userId: new Types.ObjectId(userId) })
            .populate('courseId', 'title imageUrl')
            .sort({ createdAt: -1 })
            .exec();
    }

    async getUserReviewForCourse(userId: string, courseId: string): Promise<ReviewDocument | null> {
        return this.reviewModel.findOne({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
        }).exec();
    }

    async getCourseStats(courseId: string): Promise<{ averageRating: number; totalReviews: number; distribution: Record<number, number> }> {
        const reviews = await this.reviewModel.find({
            courseId: new Types.ObjectId(courseId),
            isActive: true,
        }).exec();

        if (reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
        }

        const totalReviews = reviews.length;
        const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = Math.round((sumRatings / totalReviews) * 10) / 10;

        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            distribution[r.rating]++;
        });

        return { averageRating, totalReviews, distribution };
    }

    async findAllWithDetails(): Promise<any[]> {
        return this.reviewModel
            .find({ isActive: true })
            .populate('userId', 'name email')
            .populate('courseId', 'title thumbnailUrl')
            .sort({ createdAt: -1 })
            .exec();
    }

    private async updateCourseRating(courseId: string): Promise<void> {
        const stats = await this.getCourseStats(courseId);
        await this.coursesService.updateRating(courseId, stats.averageRating, stats.totalReviews);
    }
}

