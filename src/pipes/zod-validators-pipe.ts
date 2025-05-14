import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform { //pipe transforma vai redirecionar o fluxo, similar ao que aprendemos no curso um do node
    constructor(private schema: ZodSchema) { } //aqui ele recebe um schema do Zod na construção do objeto dessa classe

    transform(value: unknown) { //aqui ele recebe um objeto; este é o metodo que vai receber o objeto, transformar e direcionar.
        try {
            return this.schema.parse(value); //aqui ele está buscando o objeto iniciado na instancia da classe e fazendo o parse
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException({
                    message: "Validation failed",
                    statusCode: 400,
                    errors: fromZodError(error),
                });
            }
        }
    }
}