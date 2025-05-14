import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config'; //serve para configurar o modulo
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate-controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';

@Module({ //junta tudo, como se fosse um bundler
  imports: [ConfigModule.forRoot({ //forRoot serve para passarmos configurações, bem como variaveis de ambiente
    validate: env => envSchema.parse(env), //env aqui são as variaveis de ambiente que pegamos do .env e usamos o parse que criamos
    isGlobal: true, //tornar acessivel para todos
  }),
    AuthModule,
  ],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController], //controllers são sempre os receptores dos dados, assim como no projeto anterior (com Fastify())
  providers: [PrismaService], //aqui são auxliares (semelhante a useCases e Repositories)
  exports: [PrismaService]
})
export class AppModule { }