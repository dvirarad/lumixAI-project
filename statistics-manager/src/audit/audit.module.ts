import {ConsoleLogger, Module} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {DbClientModule} from "../db-client/db-client.module";
import {RABBITMQ_HOST_NAME, RMQ_LOGS_EXCHANGE, TOPIC} from "../config";

@Module({
  imports:[DbClientModule,RabbitMQModule.forRoot(RabbitMQModule, {
    exchanges: [
      {
        name: RMQ_LOGS_EXCHANGE,
        type: TOPIC,
      },
    ],
    uri: `amqp://${RABBITMQ_HOST_NAME}`,
    connectionInitOptions: { wait: false },
  }),
  ],
  controllers: [AuditController],
  providers: [AuditService,ConsoleLogger]
})
export class AuditModule {}
