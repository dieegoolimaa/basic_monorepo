import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesSeeder implements OnModuleInit {
    private readonly logger = new Logger(CoursesSeeder.name);

    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    ) { }

    async onModuleInit() {
        await this.seedCourses();
    }

    private async seedCourses() {
        const count = await this.courseModel.countDocuments().exec();
        if (count > 0) {
            this.logger.log('Courses already exist');
            return;
        }

        const courses = [
            {
                title: 'Curso Bare',
                subtitle: 'Manicure Russa e Cutilagem Perfeita',
                description: 'A técnica que revoluciou o mercado europeu agora ao seu alcance. Domine a cutilagem hardware e o alinhamento perfeito para resultados naturais e duradouros.',
                instructor: 'Bárbara Silva',
                imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070&auto=format&fit=crop', // Manicure
                thumbnailUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070&auto=format&fit=crop',
                isActive: true,
                modules: [
                    {
                        id: 'mod_bare_1',
                        title: 'Módulo 1: Teoria e Fundamentos',
                        description: 'A base sólida para uma execução impecável. Entenda a anatomia, química e biossegurança.',
                        lessons: [
                            {
                                id: 'les_bare_1',
                                title: 'Anatomia da Unha Natural',
                                description: 'Compreenda a estrutura da lâmina ungueal para evitar danos.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '15:00',
                                contentType: 'video'
                            },
                            {
                                id: 'les_bare_2',
                                title: 'Química dos Produtos',
                                description: 'Escolhendo os materiais corretos para cada tipo de unha.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '20:00',
                                contentType: 'video'
                            }
                        ]
                    },
                    {
                        id: 'mod_bare_2',
                        title: 'Módulo 2: Prática da Manicure Russa',
                        description: 'Passo a passo detalhado da técnica de cutilagem com brocas.',
                        lessons: [
                            {
                                id: 'les_bare_3',
                                title: 'Preparação e Levantamento da Cutícula',
                                description: 'O segredo para um bolso perfeito.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '25:00',
                                contentType: 'video'
                            },
                            {
                                id: 'les_bare_4',
                                title: 'Corte Contínuo com Tesoura',
                                description: 'Técnica de corte seguro e limpo.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '30:00',
                                contentType: 'video'
                            }
                        ]
                    }
                ],
                benefits: [
                    { title: 'Certificado Internacional', description: 'Reconhecido em toda a União Europeia.' },
                    { title: 'Acesso Vitalício', description: 'Revise as aulas sempre que precisar.' },
                    { title: 'Suporte Exclusivo', description: 'Tire dúvidas diretamente com a instrutora.' },
                    { title: 'Apostila Digital', description: 'Material de apoio completo em PDF.' }
                ]
            },
            {
                title: 'Mentoria VIP',
                subtitle: 'Eleve sua Carreira ao Próximo Nível',
                description: 'Uma jornada personalizada para nail designers que desejam se destacar no mercado, aumentar seu faturamento e construir uma marca de luxo.',
                instructor: 'Bárbara Silva',
                imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop', // Business Woman
                thumbnailUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop',
                isActive: true,
                modules: [
                    {
                        id: 'mod_ment_1',
                        title: 'Posicionamento de Marca',
                        description: 'Como criar uma imagem de alto valor e atrair clientes premium.',
                        lessons: [
                            {
                                id: 'les_ment_1',
                                title: 'Definindo sua Identidade',
                                description: 'Construindo um perfil profissional magnético.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '40:00',
                                contentType: 'video'
                            }
                        ]
                    },
                    {
                        id: 'mod_ment_2',
                        title: 'Gestão e Precificação',
                        description: 'Aprenda a cobrar o valor justo pelo seu trabalho.',
                        lessons: [
                            {
                                id: 'les_ment_2',
                                title: 'Calculando seus Custos',
                                description: 'Nunca mais pague para trabalhar.',
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                duration: '35:00',
                                contentType: 'video'
                            }
                        ]
                    }
                ],
                benefits: [
                    { title: 'Sessões Ao Vivo', description: 'Mentoria em grupo quinzenal via Zoom.' },
                    { title: 'Análise de Perfil', description: 'Feedback personalizado do seu Instagram.' },
                    { title: 'Grupo de Networking', description: 'Conecte-se com outras profissionais de elite.' },
                    { title: 'Acesso a Templates', description: 'Modelos prontos para posts e contratos.' }
                ]
            }
        ];

        for (const course of courses) {
            await this.courseModel.create(course);
        }

        this.logger.log('Courses seeded successfully');
    }
}
