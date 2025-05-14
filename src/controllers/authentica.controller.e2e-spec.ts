import { PrismaService } from "../prisma/prisma.service";
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
        const moduleRef = await Test.createTestingModule({ //Test é uma função do proprio Nest para realizarmos testes na nossa aplicação
            imports: [AppModule], //usando o appModule pra criar esse servidor de testes
        })
            .compile(); //compila e joga no moduleRef 

        app = moduleRef.createNestApplication(); //aqui é nosso servidor que fica armazenado na constante 'app', similar ao que temos no main.ts () const app = await NestFactory.create(AppModule, { ... )

        prisma = moduleRef.get(PrismaService) //aqui ele busca o provider "PrismaService" que foi declarado lá no AppModule

        await app.init(); //aqui ele está inicializando o servidor, similar ao que ocorre no main.ts | await app.listen(port);

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
        expect(response.body).toEqual({
            access_token: expect.any(String),
        })
    })
})