import { Injectable, BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload } from './schemas/upload.schema';
import { UploadFileDto } from './dto/upload.dto';

@Injectable()
export class UploadsService {
    // Limites de tamanho (em MB)
    private readonly MAX_IMAGE_SIZE_MB = 5;
    private readonly MAX_VIDEO_SIZE_MB = 50;

    constructor(
        @InjectModel(Upload.name) private uploadModel: Model<Upload>,
    ) { }

    async uploadFile(uploadDto: UploadFileDto, userId?: string) {
        // Extrair informações do base64
        const base64Match = uploadDto.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!base64Match) {
            throw new BadRequestException('Formato de base64 inválido. Use: data:mime/type;base64,...');
        }

        const mimeType = base64Match[1];
        const base64Data = base64Match[2];

        // Calcular tamanho do arquivo
        const sizeInBytes = this.getBase64Size(base64Data);
        const sizeInMB = sizeInBytes / (1024 * 1024);

        // Validar tamanho baseado no tipo
        if (uploadDto.type === 'image' && sizeInMB > this.MAX_IMAGE_SIZE_MB) {
            throw new PayloadTooLargeException(
                `Imagem muito grande. Tamanho máximo: ${this.MAX_IMAGE_SIZE_MB}MB. Tamanho atual: ${sizeInMB.toFixed(2)}MB`
            );
        }

        if (uploadDto.type === 'video' && sizeInMB > this.MAX_VIDEO_SIZE_MB) {
            throw new PayloadTooLargeException(
                `Vídeo muito grande. Tamanho máximo: ${this.MAX_VIDEO_SIZE_MB}MB. Tamanho atual: ${sizeInMB.toFixed(2)}MB`
            );
        }

        // Validar tipo MIME
        this.validateMimeType(mimeType, uploadDto.type);

        // Salvar no banco
        const upload = new this.uploadModel({
            filename: uploadDto.filename,
            mimeType,
            base64Data,
            size: sizeInBytes,
            type: uploadDto.type,
            uploadedBy: userId,
        });

        const saved = await upload.save();

        return {
            id: saved._id,
            filename: saved.filename,
            mimeType: saved.mimeType,
            size: saved.size,
            type: saved.type,
            url: `/api/uploads/${saved._id}`, // URL para recuperar o arquivo
            createdAt: saved.createdAt,
        };
    }

    async getFile(id: string) {
        const upload = await this.uploadModel.findById(id);
        if (!upload) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        return {
            id: upload._id,
            filename: upload.filename,
            mimeType: upload.mimeType,
            base64: `data:${upload.mimeType};base64,${upload.base64Data}`,
            size: upload.size,
            type: upload.type,
            createdAt: upload.createdAt,
        };
    }

    async getFileBuffer(id: string) {
        const upload = await this.uploadModel.findById(id);
        if (!upload) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        return {
            buffer: Buffer.from(upload.base64Data, 'base64'),
            mimeType: upload.mimeType,
        };
    }

    async deleteFile(id: string, userId?: string) {
        const upload = await this.uploadModel.findById(id);
        if (!upload) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        // Opcional: verificar se o usuário é o dono do arquivo
        // if (userId && upload.uploadedBy !== userId) {
        //     throw new ForbiddenException('Você não tem permissão para deletar este arquivo');
        // }

        await this.uploadModel.findByIdAndDelete(id);
        return { message: 'Arquivo deletado com sucesso' };
    }

    private getBase64Size(base64String: string): number {
        // Remove padding characters
        const padding = (base64String.match(/=/g) || []).length;
        // Calculate size in bytes
        return (base64String.length * 3) / 4 - padding;
    }

    private validateMimeType(mimeType: string, type: string) {
        const imageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const videoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

        if (type === 'image' && !imageMimes.includes(mimeType)) {
            throw new BadRequestException(
                `Tipo de imagem não suportado: ${mimeType}. Formatos aceitos: JPEG, PNG, GIF, WebP`
            );
        }

        if (type === 'video' && !videoMimes.includes(mimeType)) {
            throw new BadRequestException(
                `Tipo de vídeo não suportado: ${mimeType}. Formatos aceitos: MP4, WebM, OGG, MOV`
            );
        }
    }
}
