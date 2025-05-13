import { PrismaClient } from "generated/prisma/client"
import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"

function generateUniqueDatabaseURL(schemaId: string) {
    if (!process.env.DATABASE_URL) { //DATABASE_URL="postgresql://postgres:docker@localhost:5432/nest-clean?schema=public" | No postgrees podemos mudar o schema e teremos um 'novo banco de dados' dentro do próprio banco, como se fosse uma branch
        throw new Error("Please provide a DATABASE_URL environment variable.")
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set("schema", schemaId)

    return url.toString()
}

const schemaId = randomUUID()

const prisma = new PrismaClient()

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseURL(randomUUID())

    process.env.DATABASE_URL = databaseURL //estamos sobreescreveneod as variaveis de ambiente com as novas variaveis geradas - ele sobrescreve toda vez que o teste é gerado, mas assim que é executado o projeto sem os testes ele faz a leitura do arquivo novamente

    execSync("npx prisma migrate deploy") //deplor no lugar do dev, pois deploy ele roda as migration no banco, já o dev faz a leitura do schema pra ver se algo foi alterado e alterar isso no banco, já o deploy sobe as tabelas sem tantos checks
})

afterAll(async () => {
    prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`) //pois será feito uma execução perigoso, por isso precisa ser unsafe
    prisma.$disconnect
})