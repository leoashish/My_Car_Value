import { Injectable ,NotFoundException} from '@nestjs/common';
import {ObjectID, Repository} from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import  {User} from "./user.entity";
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService { 
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    public async create(email:string, password:string){
        const user = this.repo.create({email, password});

        return this.repo.save(user);
    }

    public async findOne(id:number){
        return this.repo.findOne({where: {id: id}});
    }

    public  async find(email:string){
        return this.repo.find({where: {email}});
    }
    public async update(id:number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException("User not Found!!!");
        }
        Object.assign(user , attrs);
        return await this.repo.save(user);
    }
    public async remove(id:number){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException("User not Found!!");
        }
        return await this.repo.remove(user); 
    }

}
