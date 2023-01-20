import {ConsoleLogger, Injectable} from '@nestjs/common';
import {RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {DbClientService} from "../db-client/db-client.service";
import {filterDTO} from "./dto/filter.dto";
import {RABBITMQ_LOGS_QUEUE, RABBITMQ_LOGS_ROUTE, RMQ_LOGS_EXCHANGE} from "../config";

@Injectable()
export class AuditService {

    private readonly collectionName = 'audit';
    constructor(private readonly dbClientService: DbClientService,
                private readonly logger: ConsoleLogger) {

    }

    @RabbitRPC({
        exchange: RMQ_LOGS_EXCHANGE,
        routingKey: RABBITMQ_LOGS_ROUTE,
        queue: RABBITMQ_LOGS_QUEUE,
    })
    async create(msg: any) {
        this.logger.debug(`Received message from logs_exchange exchange ${JSON.stringify(msg)}`);
        await this.dbClientService.ensureIndex(this.collectionName, {created_at: 1});
        await this.dbClientService.ensureIndex(this.collectionName, {text:1});
        await this.dbClientService.insert( this.collectionName,msg);
    }


    async find(filter: filterDTO) {
        this.logger.debug(`Received request to find audit logs with filter ${JSON.stringify(filter)}`);
        const mongoQuery = this.buildMongoQuery(filter)
        //@ts-ignore
        const data:AuditDTO[] = await this.dbClientService.find(this.collectionName, mongoQuery)
        return {data: data, count: data.length}
    }

    private buildMongoQuery(filter: filterDTO) {
        const mongoQuery = {};
        if (filter.startTime || filter.endTime) {
            mongoQuery["created_at"] = {};
            if (filter.startTime) {
                mongoQuery["created_at"]["$gte"] = filter.startTime;
            }
            if (filter.endTime) {
                mongoQuery["created_at"]["$lte"] = filter.endTime;
            }
        }
        if (filter.text) {
            mongoQuery["text"] = filter.text;
        }
        if (filter.operation) {
            mongoQuery["operation"] = filter.operation;
        }
        if (filter.status) {
            mongoQuery["status"] = filter.status;
        }
        return mongoQuery;
    }
}
