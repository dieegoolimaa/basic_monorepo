import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSettings, SiteSettingsDocument } from './schemas/site-settings.schema';
import { UpdateSiteSettingsDto } from './dto/site-settings.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(SiteSettings.name) private settingsModel: Model<SiteSettingsDocument>,
    ) { }

    /**
     * Get current site settings (creates default if not exists)
     */
    async getSettings(): Promise<SiteSettingsDocument> {
        let settings = await this.settingsModel.findOne({ key: 'default' }).exec();

        // Default values template to ensure all fields exist
        const defaultValues = {
            aboutTag: 'Sobre a Basic Studio',
            aboutTitle: 'Formando Nail Artists em Portugal',
            aboutParagraph1: 'A Basic nasceu do desejo de elevar o nível profissional do mercado de unhas.',
            aboutParagraph2: 'Nossos cursos não ensinam apenas a "fazer unhas". Ensinamos você a construir uma carreira sólida.',
            aboutImageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
            welcomeImageUrl: '',
            experienceYears: '10+',
            studentsFormed: '5k+',
            averageRating: '4.9',
            founderName: 'Cris Souza',
            coursesTag: 'MASTERCLASS SERIES',
            coursesTitle: 'Formações de Elite',
            carouselButtonText: 'DESCUBRA O MODO BASIC',
            philosophyTitle1: 'EXCLUSIVIDADE',
            philosophyDesc1: 'Metodologias únicas desenhadas para elevar o seu padrão profissional.',
            philosophyTitle2: 'MAESTRIA',
            philosophyDesc2: 'O domínio técnico aliado ao olhar artístico.',
            philosophyTitle3: 'LEGADO',
            philosophyDesc3: 'Não formamos apenas técnicos, construímos carreiras sólidas.'
        };

        if (!settings) {
            settings = await this.settingsModel.create({
                key: 'default',
                ...defaultValues
            });
        } else {
            // Check if any default field is missing and fill it
            let hasChanges = false;
            const settingsObj = settings as any;
            const defaults = defaultValues as any;

            Object.keys(defaultValues).forEach(key => {
                if (settingsObj[key] === undefined || settingsObj[key] === null) {
                    settingsObj[key] = defaults[key];
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                await settings.save();
            }
        }

        return settings;
    }

    /**
     * Update site settings
     */
    async updateSettings(updateDto: UpdateSiteSettingsDto): Promise<SiteSettingsDocument> {
        const settings = await this.settingsModel.findOneAndUpdate(
            { key: 'default' },
            { $set: updateDto },
            { new: true, upsert: true }
        ).exec();

        return settings;
    }

    /**
     * Reset settings to defaults
     */
    async resetSettings(): Promise<SiteSettingsDocument> {
        await this.settingsModel.deleteOne({ key: 'default' }).exec();
        return this.getSettings();
    }
}
