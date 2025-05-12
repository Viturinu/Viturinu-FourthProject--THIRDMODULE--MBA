import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  }) //No outro, funciona criando um Fastify() e colocando pra escutar, aqui já é feito com criando NestFacuture e passando um módulo; Similar em alguns aspectos.

  const configService = app.get<ConfigService<Env, true>>(ConfigService) //ConfigService vem após usarmos o ConfigModule,Env mostra a tipagem e true diz que fizemos a validação no module , e aí podemos pegar as envs que tratamos lá
  const port = configService.get("PORT", { infer: true })

  await app.listen(port);

  // await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
