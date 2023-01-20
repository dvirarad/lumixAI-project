import { Module } from '@nestjs/common';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {AmqpService} from "./amqp.service";
import {RMQ_LOGS_EXCHANGE, TOPIC} from "../../config";
//docker pull rabbitmq:3-management
//docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: RMQ_LOGS_EXCHANGE,
          type: TOPIC,
        },
      ],
      uri: `amqp://${process.env.RABBITMQ_HOST_NAME || "localhost"}`,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [AmqpService],
  exports: [AmqpService],
})
export class AmqpModule {}
