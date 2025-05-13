import { PrismaService } from "@/prisma/prisma.service";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import request from "supertest"
import { hash } from "bcryptjs";

//como aqui não está no proejto nest, ele será chamado pelo vitest, vamos ter que importar as variaveis de ambiente, pois aquele ConfigService não estará disponivel aqui
describe("Authenticate (E2E)", () => {

    let app: INestApplication;
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService)

        await app.init();
    });

    test("[POST]/sessions", async () => {
        await prisma.user.create({
            data: {
                name: "John Doe",
                email: "johndoe@gmail.com",
                password: await hash("123456", 8),
            }
        })

        const response = await request(app.getHttpServer()).post("/sessions").send({
            email: "johndoe@gmail.com",
            password: "123456",
        })

        expect(response.statusCode).toBe(201)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            access_token: expect.any(String),
        })
    })
})