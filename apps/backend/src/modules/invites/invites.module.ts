import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from './schemas/invite.schema';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    ],
    controllers: [InvitesController],
    providers: [InvitesService],
    exports: [InvitesService, MongooseModule],
})
export class InvitesModule { }
