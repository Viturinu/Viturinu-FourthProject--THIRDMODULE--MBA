import { PrismaService } from "@/prisma/prisma.service";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import request from "supertest"
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

//como aqui não está no proejto nest, ele será chamado pelo vitest, vamos ter que importar as variaveis de ambiente, pois aquele ConfigService não estará disponivel aqui
describe("Fetch recent questions (E2E)", () => {

    let app: INestApplication;
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService)

        jwt = moduleRef.get(JwtService)

        await app.init();
    });

    test("[GET]/questions", async () => {

        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                email: "johndoe@gmail.com",
                password: await hash("123456", 8),
            }
        })

        const accessToken = jwt.sign({ sub: user.id })

        await prisma.question.createMany({
            data: [
                {
                    title: "Question 01",
                    slug: "question-1",
                    content: "Question content",
                    authorId: user.id,
                },
                {
                    title: "Question 02",
                    slug: "question-2",
                    content: "Question content",
                    authorId: user.id,
                }
            ]
        })

        const response = await request(app.getHttpServer())
            .get("/questions")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "New question",
                content: "Question content",
            })

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: "Question 01" }),
                expect.objectContaining({ title: "Question 02" }),
            ]
        }) //é um valor válido? Isso que toBeTruthy faz
    })
})