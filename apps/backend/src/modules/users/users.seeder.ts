import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder implements OnModuleInit {
    private readonly logger = new Logger(UsersSeeder.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
        await this.seedStudent();
    }

    private async seedAdmin() {
        const adminEmail = 'admin@basic.com';

        const existingAdmin = await this.userModel.findOne({ email: adminEmail }).exec();
        if (existingAdmin) {
            this.logger.log('Admin user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = new this.userModel({
            name: 'Administrador',
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
        });

        await admin.save();
        this.logger.log('Admin user created: admin@basic.com');
    }

    private async seedStudent() {
        const studentEmail = 'student@basic.com';

        const existingStudent = await this.userModel.findOne({ email: studentEmail }).exec();
        if (existingStudent) {
            this.logger.log('Student user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('student123', 10);

        const student = new this.userModel({
            name: 'Estudante Teste',
            email: studentEmail,
            password: hashedPassword,
            role: UserRole.STUDENT,
            isActive: true,
        });

        await student.save();
        this.logger.log('Student user created: student@basic.com');
    }
}
