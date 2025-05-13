import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "src/env";
import { z } from "zod"

const tokenPayloadSchema = z.object({
    sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { //estende uma biblioteca pronta para verificação da autenticidade com a chave pública (essa é a receita, mesmo que confuso) - isso é um provider

    constructor(config: ConfigService<Env, true>) { //passando o ConfigService com as variaveis de ambiente pra cá
        const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true })//pegando a variavel de ambiente

        super({ //super chama o constructor do PassportStrategy - esses elementos estão todos na documentação
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, "base64"),
            algorithms: ["RS256"],
        })
    }

    async validate(payload: UserPayload) {
        return tokenPayloadSchema.parse(payload)
    }
}