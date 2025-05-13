import { PrismaService } from "@/prisma/prisma.service";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import request from "supertest"
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

//como aqui não está no proejto nest, ele será chamado pelo vitest, vamos ter que importar as variaveis de ambiente, pois aquele ConfigService não estará disponivel aqui
describe("Create questions (E2E)", () => {

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

    test("[POST]/questions", async () => {

        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                email: "johndoe@gmail.com",
                password: await hash("123456", 8),
            }
        })

        const accessToken = jwt.sign({ sub: user.id })

        const response = await request(app.getHttpServer())
            .post("/questions")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "New question",
                content: "Question content",
            })

        expect(response.statusCode).toBe(201)

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: "New question"
            }
        })

        expect(questionOnDatabase).toBeTruthy() //é um valor válido? Isso que toBeTruthy faz
    })
})