import {
    UseInterceptors, 
    NestInterceptor,
    ExecutionContext, 
    CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass, plainToClassFromExist, plainToInstance } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";

export function Serialize(dto:any){
    return UseInterceptors(new SerializerInterceptor(dto));
}
export class SerializerInterceptor implements NestInterceptor {
    constructor(private dto:any){

    }
   intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
       return handler.handle().pipe( 
        map((data:any) => {
        const object = plainToInstance(this.dto , data , {
            excludeExtraneousValues: true
       });
       console.log(object);
       return object;
   }),
)
}
}
