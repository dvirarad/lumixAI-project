import { Injectable } from '@nestjs/common';
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class AmqpService {

    constructor(private readonly amqpConnection: AmqpConnection) {}

    publishToExchange(exchange: string, routingKey: string, message: any) {
        this.amqpConnection.publish(exchange, routingKey, message);
    }

}
