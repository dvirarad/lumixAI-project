import {ConsoleLogger, Injectable} from '@nestjs/common';
import {DataFetcherDto, DataFetcherResponseDto} from './dto/data-fetcher.dto';
import {HttpService} from "@nestjs/axios";
import {DbClientService} from "../db-client/db-client.service";
import {firstValueFrom} from "rxjs";
import {AmqpService} from "../amqp/amqp.service";
import {AuditDTO} from "./dto/audit.dto";
import {WordsCounterService} from "../words-counter/words-counter.service";
import {
    RABBITMQ_LOGS_ROUTE,
    RMQ_LOGS_EXCHANGE,
    TOTAL_INSERT_DATA_PER_REQUEST
} from "../../config";

@Injectable()
export class DataFetcherService {

    private readonly STATUS_SUCCESS = "success";
    private readonly STATUS_ERROR = "error";

    constructor(private readonly httpService: HttpService,
                private readonly dbClientService: DbClientService,
                private readonly amqpService: AmqpService,
                private logger: ConsoleLogger,
                private wordsCounterService: WordsCounterService) {
    }

    async insertData(createDataFetcherDto: DataFetcherDto): Promise<DataFetcherResponseDto> {
        let response;
        let status = this.STATUS_SUCCESS;
        let totalInsertedData = 0;
        let hasNextPage = true;
        let url = createDataFetcherDto.url;
        try {
            while (hasNextPage) {
                this.logger.log("Fetching data from url: " + url);
                response = await this.fetchData(url);
                url = response.data.nextPage;
                await this.dbClientService.insertMany(response.data.data);
                totalInsertedData += response.data.data.length;
                this.logger.log("Total inserted data: " + totalInsertedData);
                this.wordsCounterService.countWords(response.data.data);
                if (totalInsertedData >= TOTAL_INSERT_DATA_PER_REQUEST) {
                    hasNextPage = false;
                }
            }
        } catch (error) {
            status = this.STATUS_ERROR;
        }

        this.handleAudit(createDataFetcherDto.url, totalInsertedData, status, "insertData");
        return this.createDataFetcherResponseDto(status, createDataFetcherDto, totalInsertedData);
    }

    private async fetchData(url: string): Promise<DataFetcherResponseDto> {
        return firstValueFrom(this.httpService.get(url, {
            headers: {"Accept-Encoding": "gzip,deflate,compress"}
        }));
    }


    async search(text: string) {
        this.logger.log("Searching data for text: " + text);
        let data;
        let status = this.STATUS_SUCCESS;
        try {
            data = await this.dbClientService.search(text);
        } catch (error) {
            status = this.STATUS_ERROR;
        }
        this.handleAudit(text, data.length, status, "search");
        return this.createDataSearchResponseDTO(data);
    }

    private handleAudit(text: string, count, status: string, operation: string) {
        const auditLog: AuditDTO = this.getAuditLog(text, count, status, operation);
        this.logger.debug("Sending audit log to queue: " + JSON.stringify(auditLog));
        this.amqpService.publishToExchange(RMQ_LOGS_EXCHANGE, RABBITMQ_LOGS_ROUTE, auditLog);
    }

    private getAuditLog(text: string, count, status: string, operation: string): AuditDTO {
        return {
            operation: operation,
            text: text,
            created_at: new Date().getTime(),
            count: count || 0,
            status: status
        };
    }

    private createDataFetcherResponseDto(status, createDataFetcherDto: DataFetcherDto, totalInsertedData: number) {
        const time = new Date().getTime();
        let count = 0;
        let message = "Data fetched with error";
        if (status === this.STATUS_SUCCESS) {
            count = totalInsertedData;
            message = "Data fetched successfully";
        }
        return {
            data: {
                message: message,
                url: createDataFetcherDto.url,
                time: time,
                count: count
            }
        };
    }

    private createDataSearchResponseDTO(data) {
        return {
            data: data,
            count: data.length
        }
    }
}
