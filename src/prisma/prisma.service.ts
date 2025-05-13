import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { //como se fosse a conexão com o bancoi que fizemos no projeto passado
    // public client: PrismaClient //classe que contém os tipos gerados pelo schema (npx prisma generate) | mas resolvemos extender ao inves de declarar objeto dessa classe

    constructor() {
        super({
            log: ["warn", "error"],
        })
        // this.client = new PrismaClient() //instancia 
    }

    onModuleInit() { //quando algo será inicializado, realizar o que está no corpo, no caso a conexão
        return this.$connect()
    }

    onModuleDestroy() { //quando algo será destruido, realizar o que está no corpo, no caso a desconexão
        return this.$disconnect()
    }

}