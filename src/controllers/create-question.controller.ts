import { Body, Controller, Post, Req, Request, UseGuards, UsePipes } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validators-pipe";
import { PrismaService } from "src/prisma/prisma.service"; //só está sendo possivel usar aqui porque eu injetei lá no app.module.ts em providers
import { z } from "zod"

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema) //frufru

@Controller("/questions")
@UseGuards(JwtAuthGuard) //esse jwt quer dizer que eu quero usar a estrategia passport-jwt
export class CreateQuestionController {
    constructor(
        private prisma: PrismaService
    ) { } //pegando a conexão com o banco de dados que fizemos lá dentro da folder Prisma

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateAccountBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body
        const { sub: userId } = user
        const slug = this.convertToSlug(title)

        console.log({
            authorId: userId,
            title,
            content,
            slug,
        })

        await this.prisma.question.create({
            data: {
                authorId: userId,
                title,
                content,
                slug,
            },
        })
    }

    private convertToSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
    }
}
