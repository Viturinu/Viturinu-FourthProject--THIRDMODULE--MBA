import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { //como se fosse a conexão com o bancoi que fizemos no projeto passado
    // public client: PrismaClient //classe que contém os tipos gerados pelo schema (npx prisma generate) | mas resolvemos extender ao inves de declarar objeto dessa classe

    constructor() {
        super({
            log: ["warn", "error"],
        })
        // this.client = new PrismaClient() //instancia 
    }

    onModuleInit() { //quando o módulo que usa esse Injectable é inicializado ele executa a função abaixo, no caso a conexão
        return this.$connect()
    }

    onModuleDestroy() { //quando o módulo que usa esse Injectable é destruído ele executa a função abaixo, no caso a conexão
        return this.$disconnect()
    }

}