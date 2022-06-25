import { Body, Controller, Delete, Get, Param, Patch, Post, Query,Put } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
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
        return await this.userService.findOne(parseInt(id));
    }

    @Get()
    async findAllUsers(@Query("email") email:string){
        return await this.userService.find(email);
    }
    
    @Put("/:id")
    async updateAUser(@Body() body:UpdateUserDto,@Param("id") id:string){
        return  this.userService.update(parseInt(id) , body);
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id:string){
        return this.userService.remove(parseInt(id));
    }

}
