import {ConsoleLogger, Injectable} from '@nestjs/common';
import {RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {DbClientService} from "../db-client/db-client.service";
import {WordCounterDTO} from "./dto/word-counter.dto";
import {RABBITMQ_WORDS_COUNTER_QUEUE, RABBITMQ_WORDS_COUNTER_ROUTE, RMQ_WORDS_COUNTER_EXCHANGE} from "../config";

@Injectable()
export class WordCounterService {

    private readonly collectionName = 'word-counter';

    constructor(private readonly dbClientService: DbClientService, private readonly logger: ConsoleLogger) {
    }


    @RabbitRPC({
        exchange: RMQ_WORDS_COUNTER_EXCHANGE,
        routingKey: RABBITMQ_WORDS_COUNTER_ROUTE,
        queue: RABBITMQ_WORDS_COUNTER_QUEUE,
    })
    async handle(msg: string[][]): Promise<void> {
        this.logger.log("Received message from words-counter exchange");
        //create counter for each string in the msg matrix
        const counter = {};
        msg.forEach((wordVector) => {
            wordVector.forEach((word) => {
                counter[word] = counter[word] ? counter[word] + 1 : 1;
            });
        });

        //insert the counter to the mongodb using $inc function for each worn in counter object
        // the mongodb should be 2 columns collection: word and count
        // the $inc function will increment the count column by the value of the counter object
        // for example: if the counter object is {a: 2, b: 3} the $inc function will increment the count column by 2 for word a and by 3 for word b
        await this.dbClientService.ensureIndex(this.collectionName, {counter: 1});
        const bulkUpdateList =[];
        for (let word in counter) {
            bulkUpdateList.push({selector: {word: word}, updateDocument: {$inc: {counter: counter[word]}}});
        }
        await this.dbClientService.initializeUnorderedBulkOp(this.collectionName,bulkUpdateList);
        this.logger.log("Finished handling message from words-counter exchange");
    }

    async getTop(topNumber: number) : Promise<WordCounterDTO[]> {
        const filter = {};
        const sort = {
            'counter': -1
        };
        const data = await this.dbClientService.find(this.collectionName, filter, sort, topNumber)
        return data.map((item) => {
            return {
                word: ""+item.word,
                count: item.counter
            }
        });

    }
}
