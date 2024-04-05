import { Module, Global } from '@nestjs/common';

import { Client } from 'pg';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

const client = new Client({
  user: 'postgres',
  host: 'pgdb-msr.crum4wauqhme.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: '12345678',
  port: 5432,
  ssl: true,
});
client.connect();
client.query('SELECT * FROM task ORDER BY id ASC', (err, res) => {
  console.error(err);
  console.log(res.rows);
});

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const {dbName, host, port, user, password} = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          ssl: true,
          synchronize: true, // 👈 new attr
          autoLoadEntities: true, // 👈 new attr
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const {dbName, host, port, user, password} = configService.postgres;
        const client = new Client({
          user,
          host,
          database: dbName,
          password,
          port,
          ssl:true,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    }],
  exports: ['API_KEY', 'PG', TypeOrmModule],
})
export class DatabaseModule {}
