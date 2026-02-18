import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesSeeder } from './courses.seeder';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService, CoursesSeeder],
    exports: [CoursesService, MongooseModule],
})
export class CoursesModule { }
