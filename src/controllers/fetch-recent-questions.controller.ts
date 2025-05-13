import { Body, Controller, Get, Post, Query, Req, Request, UseGuards, UsePipes } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validators-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod"

const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe( //z.string().optional().default("1").transform(Number), logo será convertido em Number, e aí fazemos o pipe pra aí sim validar qualquer coisa
    z.number().min(1)
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/questions")
@UseGuards(JwtAuthGuard) //esse jwt quer dizer que eu quero usar a estrategia passport-jwt
export class FetchRecentQuestionsController {
    constructor(
        private prisma: PrismaService
    ) { } //pegando a conexão com o banco de dados que fizemos lá dentro da folder Prisma

    @Get()
    async handle(
        @Query("page", queryValidationPipe) page: PageQueryParamSchema
    ) {
        const perPage = 20

        const questions = await this.prisma.question.findMany({
            take: perPage,
            skip: (page - 1) * 1,
            orderBy: {
                createdAt: "desc",
            },
        })

        return {
            questions
        }
    }
}