import { Module } from '@nestjs/common';
import { WordsCounterService } from './words-counter.service';
import {WordVectorProvider} from "./word-vector.provider";
import {AmqpModule} from "../amqp/amqp.module";

@Module({
  imports: [AmqpModule],
  providers: [WordsCounterService,WordVectorProvider],
  exports: [WordsCounterService]
})
export class WordsCounterModule {}
