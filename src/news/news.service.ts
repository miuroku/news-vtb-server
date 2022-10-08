import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
const queryString = require('query-string');
let http = require('http');

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

    console.log(`We are here !!!`);
    const data = queryString.stringify({
      sphere: sphere,
      sphere_description: sphereDescription || ' '
    });

    console.log(`Data : ${data}`);

    const options = {
      host: 'localhost',
      port: 8000,
      path: '/digest',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    let httpReq = http.request(options, this.processDigestResponse);
    httpReq.write(data);
    httpReq.end();

    return null;
  }
  
  async processDigestResponse(response: any) {
    response.setEncoding('utf-8');

    response.on('data', function (chunk) {
      console.log("body : " + chunk);
    });

    response.on('end', function () {
      return 200;
    })
  }

}
