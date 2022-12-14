import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
//import { response } from 'express';
import { UsersService } from 'src/users/users.service';
const queryString = require('query-string');
let http = require('http');
var res = null;

@Injectable()
export class NewsService {
  constructor(private usersService: UsersService) {}

  async getTrends(user: any) {
    res = null;

    const sphereInfo = await this.getSphereAndSphereDescByUserId(user.userId);
    const data = queryString.stringify(sphereInfo);
    const options = await this.constructOptions(data, 'trends');

    await this.makeRequestToAnotherServer(options, data);

    return res;
  }

  async getInsights(user: any) {
    res = null;

    const sphereInfo = await this.getSphereAndSphereDescByUserId(user.userId);
    const data = queryString.stringify(sphereInfo);
    const options = await this.constructOptions(data, 'trends');

    await this.makeRequestToAnotherServer(options, data);

    return res;
  }

  async getDigest(user: any) {
    res = null;
    // const sphere = await this.usersService.getSphereByUserId(user.userId);
    // const sphereDescription = sphere.description;
    const sphereInfo = await this.getSphereAndSphereDescByUserId(user.userId);

    const data = queryString.stringify(sphereInfo);

    // const options = {
    //   host: process.env.ML_SERVER_HOST || 'localhost',
    //   port: parseInt(process.env.ML_SERVER_PORT) || 8000,
    //   path: `/digest?${data}`,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Content-Length': Buffer.byteLength(data)
    //   }
    // };
  
    const options = await this.constructOptions(data, 'digest');

    // let httpReq = http.request(options, this.processDigestResponse);
    // httpReq.write(data);

    // httpReq.on('error', (e) => {
    //   console.log(`Your error : ${JSON.stringify(e, null, 4)}`);
    //   res = null;      
    // });

    // httpReq.end();
    
    await this.makeRequestToAnotherServer(options, data);

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

  async getSphereAndSphereDescByUserId(userId: number) {
    const sphere = await this.usersService.getSphereByUserId(userId);
    const sphereDescription = sphere.description;

    return {
      sphere: sphere.title,
      sphere_description: sphereDescription || ' '
    }
  }

  async constructOptions(data: any, urlPath: string) {
    const readyOptions = {
      host: process.env.ML_SERVER_HOST || 'localhost',
      port: parseInt(process.env.ML_SERVER_PORT) || 8000,
      path: `/${urlPath}?${data}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }; 
  }

  async makeRequestToAnotherServer(options: any, data: any) {
    let httpReq = http.request(options, this.processDigestResponse);
    httpReq.write(data);

    httpReq.on('error', (e) => {
      console.log(`Your error : ${JSON.stringify(e, null, 4)}`);
      res = null;      
    });

    httpReq.end();
  }
}
