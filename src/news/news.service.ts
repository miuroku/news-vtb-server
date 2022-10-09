import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
//import { response } from 'express';
import { UsersService } from 'src/users/users.service';
const queryString = require('query-string');
let http = require('http');
var res = null;

@Injectable()
export class NewsService {
  constructor(private usersService: UsersService) {}

  async getTrends() {
    return null;
  }

  async getInsights() {
    return null;
  }

  async getDigest(user: any) {
    // get sphere and description from user info.

    // const user = await this.usersService.getUserById(user.userId);

    const sphere = await this.usersService.getSphereByUserId(user.userId);
    const sphereDescription = sphere.description;

    const data = queryString.stringify({
      sphere: sphere.title,
      sphere_description: sphereDescription || ' '
    });

    const options = {
      host: 'localhost',
      port: 8000,
      path: `/digest?${data}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
  
    let httpReq = http.request(options, this.processDigestResponse);
    httpReq.write(data);

    httpReq.on('error', (e) => {
      console.log(`Your error : ${JSON.stringify(e, null, 4)}`);
      res = null;      
    });

    httpReq.end();      
    

    return res;
  }
  
  async processDigestResponse(response: any) {
    response.setEncoding('utf-8');

    response.on('data', function (chunk) {
      console.log("body : " + chunk);
      res = chunk;
    });

    response.on('end', function () {
      return 200;
    })
  }

}
