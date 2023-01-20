import {WordCounterService} from "./word-counter.service";
import {Controller, Get, Query} from "@nestjs/common";
import {WordCounterDTO} from "./dto/word-counter.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('word-counter')
export class WordCounterController {
    constructor(private readonly wordCounterService: WordCounterService) {
    }
    @ApiOperation({
        summary: 'Retrieve the top N most frequent words'
    })
    @ApiResponse({
        status: 200,
        description: 'Successful retrieval of top words',
        type: WordCounterDTO,
        isArray: true
    })
    @Get()
    getTopWords(@Query('top') topNumber: number):Promise<WordCounterDTO[]> {
        return this.wordCounterService.getTop(topNumber);
    }
}

