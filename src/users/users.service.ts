import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // fake DB
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme'
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess'
    }
  ];
  private lastId = 2;

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username
      }
    });
    //return this.users.find(user => user.username == username);
    return user;
  }

  async createOne(username: string, password: string, sphere_title: string): Promise<User | undefined> {
    //const newUser = {userId: this.lastId++, username: username, password: password};
    // this.users.push(newUser);
    // return newUser;
    let sphere = await this.prisma.sphere.findFirst({
      where: {
        title: sphere_title
      }
    });

    if (!sphere) {
      sphere = await this.prisma.sphere.create({
        data: {
          title: sphere_title,
          description: null
        }
      });
    }
    const newUser = await this.prisma.user.create({
      data: {
        username: username,
        hashedPass: password,
        hash: password,
        sphereId: sphere.id
      }
    })

    return newUser;
  }

  async deleteOne(username: string) {
    await this.prisma.user.delete({
      where: {
        username: username
      }
    });
    //this.users.filter(user => !(user.username == username));
  } 
}
