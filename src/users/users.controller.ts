import { Body, Controller, Delete, Get, Param, Patch, Post, Query,NotFoundException,UseInterceptors,ClassSerializerInterceptor }from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService) {

    }
    @Post('/signup')
    createUser(@Body() body:CreateUserDto){
        this.userService.create(body.email , body.password);
    }

    
    @Get("/:id")
    async getUser(@Param("id") id: string){
        const result = await this.userService.findOne(parseInt(id));
        if(!(result)){
            throw new NotFoundException("Not Found Exception");
        }
        return result;
    }

    @Get()
    async findAllUsers(@Query("email") email:string){
        return await this.userService.find(email);
    }
    
    @Patch("/:id")
    async updateAUser( @Param("id") id:string , @Body() body:UpdateUserDto){
        return  this.userService.update(parseInt(id) , body);
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id:string){
        return this.userService.remove(parseInt(id));
    }

}
