import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { UsersService } from "./users.service";
import {randomBytes , scrypt as _scrypt} from "crypto";
import { promisify} from "util";
import { genSaltSync } from "bcrypt";
import { IS_FIREBASE_PUSH_ID } from "class-validator";
import { Not } from "typeorm";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService:  UsersService){}
    public async signup(email:string, password: string) {
        // see if the email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException("email is in use")
        }
        //Hash the users password
         //Generate a salt
         const salt = randomBytes(8).toString('hex');
         //Hash the salt and password together
         const hash = (await scrypt(password , salt , 32)) as Buffer;
         // Join the hashed result and password together
         const saltedHash = salt + '.' + hash.toString('hex');
        //Create a new user and save it
        const  user = await this.userService.create(email ,saltedHash);
        //return the user
        return user;
    }

    public async signIn(email : string, password: string){
        const [user] = await this.userService.find(email);
        if(!user){
            throw new NotFoundException("User not found!!!");
        }
         const [salt , storedHash] = user.password.split('.');
        const hash = (await scrypt(password , salt , 32)) as Buffer;
        if(storedHash === hash.toString('hex')){
            return user;
        }
        else{
            throw new NotFoundException("Wrong password!!!");
        }
    }
}