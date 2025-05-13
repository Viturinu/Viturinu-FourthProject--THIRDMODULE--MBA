import { PrismaService } from "@/prisma/prisma.service";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import request from "supertest"

//como aqui não está no proejto nest, ele será chamado pelo vitest, vamos ter que importar as variaveis de ambiente, pois aquele ConfigService não estará disponivel aqui
describe("Create account (E2E)", () => {

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

    test("[POST]/accounts", async () => {
        const response = await request(app.getHttpServer()).post("/accounts").send({
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "123456",
        })

        expect(response.statusCode).toBe(201)

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: "johndoe@gmail.com"
            }
        })

        expect(userOnDatabase).toBeTruthy() //é um valor válido? Isso que toBeTruthy faz
    })
})