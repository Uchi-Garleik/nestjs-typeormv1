import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config';
import { Client } from 'pg';

@Injectable()
export class AppService {
  constructor(
    // @Inject('API_KEY') private apiKey: string,
    @Inject('PG') private clientePG: Client,
    @Inject('TASKS') private tasks: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey;
    const name = this.configService.database.name;
    return `Hello World! ${apiKey} ${name}`;
  }
  getTasks(){
    // Todo se maneja como promesas, tiene que haber un retorno hacia el Controller
    return new Promise((resolve, reject) => {
       this.clientePG.query('SELECT * FROM task ORDER BY id ASC', (err, res) => {
        if(err){
            reject(err);
        }
        resolve(res.rows);
      });
    });
  }

}
