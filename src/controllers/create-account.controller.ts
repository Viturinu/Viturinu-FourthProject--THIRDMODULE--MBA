import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs"
import { z } from "zod"
import { ZodValidationPipe } from "src/pipes/zod-validators-pipe";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
    constructor(private prisma: PrismaService) { } //pegando a conexão com o banco de dados que fizemos lá dentro da folder Prisma

    @Post()
    @HttpCode(201) //forçando que o codigo de sucesso retornado por essa rota seja o código 201
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) { //no fastify/express, pegariamos os dados da requisição via request.body, por exemplo, mas aqui é diferente

        const { name, email, password } = body //createAccountBodySchema.parse(body) - Não preciso mais validar aqui, pois zod-validators-pipe quem está fazendo - ele é como se fosse um middleware; se não validar no zod, a aplicação já disṕara um Erro (precisamos tratar)

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (userWithSameEmail) {
            throw new ConflictException("User with same e-mail address") //existem varias excessões nativas do nestjs, basta escolehr alguma ou mesmo criar nosso proprio tratamento de erro
        }

        const hashedPassword = await hash(password, 8) //segundo aprametro pode ser um salt (que é simplismente uma palavra pára adicionar à senha e criar dificuldade), e também poder ser um numeral contendo quantos rounds queremos que esse hash gere um em cima do outro


        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        })
    }
}