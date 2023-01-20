import { Injectable } from '@nestjs/common';
import {WordVectorProvider} from "./word-vector.provider";
import {AmqpService} from "../amqp/amqp.service";
import {RABBITMQ_WORDS_COUNTER_ROUTE, RMQ_WORDS_COUNTER_EXCHANGE} from "../../config";

@Injectable()
export class WordsCounterService {
    constructor(private readonly wordVectorProvider: WordVectorProvider,
                private readonly amqpService: AmqpService,) {}

    countWords(objList: object[]) {
        const wordCountList = [];
        objList.forEach(obj => {
            const wordVector = this.wordVectorProvider.extractWords(obj);
            wordCountList.push(wordVector);
        });
        this.amqpService.publishToExchange(RMQ_WORDS_COUNTER_EXCHANGE, RABBITMQ_WORDS_COUNTER_ROUTE, wordCountList);
    }
}
