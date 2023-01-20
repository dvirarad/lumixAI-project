import {ApiProperty} from "@nestjs/swagger";

export class DataSearchResponseDTO{
    @ApiProperty({ description: 'The data of the search results' })
    data: any;
    @ApiProperty({ description: 'The count of the search results' })
    count: number;
}
