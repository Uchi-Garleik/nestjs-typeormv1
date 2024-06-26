import { Module, HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import config from './config';
import { Client } from 'pg';
import { error } from 'console';
import { BucketController } from './bucket/bucket.controller';
import { BucketModule } from './bucket/bucket.module';

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const client = new Client({
  user: 'postgres',
  host: 'pgdb-msr.crum4wauqhme.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: '12345678',
  port: 5432,
  ssl: true,
});
client.connect();
client.query('SELECT * FROM user', (err, res) => {
  console.error(err);
  console.log(res.rows);
});



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
    BucketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();
        return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
