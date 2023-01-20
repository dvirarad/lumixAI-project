import {Controller, Get, Post, Body, Query} from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import {DataFetcherDto, DataFetcherResponseDto} from './dto/data-fetcher.dto';
import {DataSearchResponseDTO} from "./dto/data-search.dto";
import {ApiBody, ApiQuery, ApiResponse} from "@nestjs/swagger";

@Controller('data-fetcher')
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Post()
  @ApiBody({ type: DataFetcherDto })
  @ApiResponse({ status: 201, description: 'Fetch data from given url to DB', type: DataFetcherResponseDto })
  create(@Body() createDataFetcherDto: DataFetcherDto): Promise<DataFetcherResponseDto> {
    return this.dataFetcherService.insertData(createDataFetcherDto);
  }

  @Get()
  @ApiQuery({ name: 'text', required: true })
  @ApiResponse({ status: 200, description: 'Search results from data imported', type: DataSearchResponseDTO })
  search(@Query('text') text: string): Promise<DataSearchResponseDTO> {
    return this.dataFetcherService.search(text);
  }

}
