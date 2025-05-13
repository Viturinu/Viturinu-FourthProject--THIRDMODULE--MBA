import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { UserPayload } from "./jwt.strategy"

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => { //pra pegar apenas o jwt, sem precisar recuperar toda a req lá no controller
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
})