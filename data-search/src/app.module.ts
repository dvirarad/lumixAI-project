import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbClientModule } from './db-client/db-client.module';
import { DataFetcherModule } from './data-fetcher/data-fetcher.module';
import { AmqpModule } from './amqp/amqp.module';
import { WordsCounterModule } from './words-counter/words-counter.module';

@Module({
  imports: [DataFetcherModule, DbClientModule, AmqpModule, WordsCounterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
