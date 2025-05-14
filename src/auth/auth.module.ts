import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "src/env"
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService], //pra poder usar o ConfigService, pois lá estão definidas as variáveis de ambiente
            global: true,
            useFactory(config: ConfigService<Env, true>) { //serve para ajudar o typescrit inferir corretamente o tipo de retorno com base na Env (generic passada)
                const privateKey = config.get("JWT_PRIVATE_KEY", { infer: true }) //base64, por isso precisamos fazer o processo inverso
                const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true })

                // console.log(Buffer.from(privateKey, 'base64').toString('utf-8'));

                return {
                    signOptions: { algorithm: "RS256" },
                    privateKey: Buffer.from(privateKey, "base64"), //não precisa toString pois aqui aceita Buffer também
                    publicKey: Buffer.from(publicKey, "base64"),
                }
            },
        })
    ],
    providers: [JwtStrategy] //pra podermos usar em outros locais
})
export class AuthModule { }