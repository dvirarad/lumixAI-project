import {ConsoleLogger, Module} from '@nestjs/common';
import { WordCounterService } from './word-counter.service';
import {DbClientModule} from "../db-client/db-client.module";
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {WordCounterController} from "./word-counter.controller";
import {RMQ_WORDS_COUNTER_EXCHANGE, TOPIC} from "../config";

@Module({
  imports:[DbClientModule,RabbitMQModule.forRoot(RabbitMQModule, {
    exchanges: [
      {
        name: RMQ_WORDS_COUNTER_EXCHANGE,
        type: TOPIC,
      },
    ],
    uri: `amqp://${process.env.RABBITMQ_HOST_NAME || "localhost"}`,
    connectionInitOptions: { wait: false },
  }),
  ],
  controllers: [WordCounterController],
  providers: [WordCounterService,ConsoleLogger]
})
export class WordCounterModule {}
