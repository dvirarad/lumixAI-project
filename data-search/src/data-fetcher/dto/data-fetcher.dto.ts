import {IsUrl} from "class-validator";
import {ApiProperty, ApiTags} from "@nestjs/swagger";

@ApiTags('data-fetcher')
export class DataFetcherDto {
    @ApiProperty({ description: 'The url of the data to fetch' })
    @IsUrl()
    readonly url: string;
}
@ApiTags('data-fetcher')
export class DataFetcherResultsDto {
    @ApiProperty({ description: 'The message of the data fetched' })
    message: string;
    @ApiProperty({ description: 'The url of the data fetched' })
    url: string;
    @ApiProperty({ description: 'The time of the data fetched' })
    time: number;
    @ApiProperty({ description: 'The count of the data fetched' })
    count: number;
}
@ApiTags('data-fetcher')
export class DataFetcherResponseDto {
    @ApiProperty({ description: 'The data has been successfully fetched.' })
    data: DataFetcherResultsDto;
}




