import { Body, Controller, Delete, Get, Param, Patch, Post, Query,NotFoundException,Session,UseInterceptors,ClassSerializerInterceptor }from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { isGeneratorFunction } from 'util/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService , private authService: AuthService) {

    }

    // @Get("whoamI") 
    // whoAmi (@Session() session: any){
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoAmI')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user:User){
        return user;
    }
    @Get('/colors/:color')
    setColor(@Param("color") color:string ,@Session() session: any) {
        session.color = color ;
    }
    @Get('/colors')
    getColor(@Session() session: any ){
        return session.color;
    }
    @Post('/signup')
    async createUser(@Body() body:CreateUserDto , @Session() session: any){
        const user = await this.authService.signup(body.email , body.password);
        session.userId = user.id;
        return user;
    }
    @Post('/signout')
    async signOut(@Session() session:any) {
        session.userId = null; 
    }
    
    @Post('/signin')
    async signIn(@Body() body: CreateUserDto , @Session() session: any) {
        const user =  await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
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


