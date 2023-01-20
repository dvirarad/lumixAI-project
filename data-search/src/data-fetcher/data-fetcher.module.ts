import {ConsoleLogger, Module} from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import { DataFetcherController } from './data-fetcher.controller';
import {HttpModule} from "@nestjs/axios";
import {DbClientModule} from "../db-client/db-client.module";
import {AmqpModule} from "../amqp/amqp.module";
import {WordVectorProvider} from "../words-counter/word-vector.provider";
import {WordsCounterModule} from "../words-counter/words-counter.module";

@Module({
  imports: [HttpModule,DbClientModule,AmqpModule,WordsCounterModule],
  controllers: [DataFetcherController],
  providers: [DataFetcherService,ConsoleLogger]
})
export class DataFetcherModule {}
