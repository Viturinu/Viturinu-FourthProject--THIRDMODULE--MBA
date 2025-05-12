import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy { //como se fosse um repository do projeto passado
    // public client: PrismaClient //classe cque contem os tipos gerados pelo schema (npx prisma generate) | mas resolvemos extender ao inves de declarar objeto dessa classe

    constructor() {
        super({
            log: ["warn", "error"],
        })
        // this.client = new PrismaClient() //instancia 
    }

    onModuleInit() {
        return this.$connect()
    }

    onModuleDestroy() {
        return this.$disconnect()
    }

}