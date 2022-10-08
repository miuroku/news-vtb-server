import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
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
    return this.users.find(user => user.username == username);
  }

  async createOne(username: string, password: string): Promise<User | undefined> {
    const newUser = {userId: this.lastId++, username: username, password: password};
    this.users.push(newUser);
    return newUser;
  }

  async deleteOne(username: string) {
    this.users.filter(user => !(user.username == username));
  } 
}
