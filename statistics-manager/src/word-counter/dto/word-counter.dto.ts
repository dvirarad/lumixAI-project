import {ApiProperty} from "@nestjs/swagger";
import {ApiPropertyOptions, ApiResponseProperty} from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class WordCounterDTO {
    @ApiProperty({
        description: 'The word'
    })
    word: string;

    @ApiProperty({
        description: 'The number of occurrences of the word'
    })
    count: number
}