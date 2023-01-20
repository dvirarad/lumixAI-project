import { HttpService } from "@nestjs/axios";
import { ConsoleLogger } from "@nestjs/common";
import { DbClientService } from "../db-client/db-client.service";
import { AmqpService } from "../amqp/amqp.service";
import { WordsCounterService } from "../words-counter/words-counter.service";
import { DataFetcherService } from "./data-fetcher.service";
import {Test, TestingModule} from "@nestjs/testing";

describe("DataFetcherService", () => {
  let dataFetcherService: DataFetcherService;
  let httpService: HttpService;
  let dbClientService: DbClientService;
  let amqpService: AmqpService;
  let wordsCounterService: WordsCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataFetcherService,
        { provide: HttpService, useValue: { get: jest.fn() }},
        { provide: DbClientService, useValue: { insertMany: jest.fn() } },
        { provide: AmqpService, useValue: { publishToExchange: jest.fn() } },
        { provide: WordsCounterService, useValue: { countWords: jest.fn() } },
        ConsoleLogger,
      ],
    }).compile();

    dataFetcherService = module.get<DataFetcherService>(DataFetcherService);
    dbClientService = module.get<DbClientService>(DbClientService);
    httpService = module.get<HttpService>(HttpService);
    amqpService = module.get<AmqpService>(AmqpService);
    wordsCounterService = module.get<WordsCounterService>(WordsCounterService);
     });

  describe("insertData", () => {
    it("should insert data and call audit function", async () => {
      const url = "testUrl";
      const data = [{test: "data1"}, {test: "data2"}];
      const nextPage = "nextUrl";
      const response = { data: { data, nextPage } };
        // @ts-ignore
      jest.spyOn(httpService, "get").mockResolvedValueOnce(() => response);
      jest.spyOn(dbClientService, "insertMany").mockImplementation(() => Promise.resolve());
      jest.spyOn(wordsCounterService, "countWords").mockImplementation(() => {});
      jest.spyOn(amqpService, "publishToExchange").mockImplementation(() => {});
      const createDataFetcherDto = { url };
      const result = await dataFetcherService.insertData(createDataFetcherDto);
      expect(httpService.get).toHaveBeenCalledWith(url, { headers: { "Accept-Encoding": "gzip,deflate,compress" } });
      expect(dbClientService.insertMany).toHaveBeenCalledWith(data);
      expect(wordsCounterService.countWords).toHaveBeenCalledWith(data);
      expect(amqpService.publishToExchange).toHaveBeenCalledWith("audit", { url, dataCount: data.length });
      expect(result.data.count).toBe(2);
      expect(result.data.url).toBe(url);
    });

    it("should handle error when fetching data", async () => {
      const url = "testUrl";
      const error = new Error("Test Error");
      // @ts-ignore
      jest.spyOn(httpService, "get").mockRejectedValue(() => error);
      jest.spyOn(console, "error").mockImplementation(() => {});
      const createDataFetcherDto = { url };
      const result = await dataFetcherService.insertData(createDataFetcherDto);
      expect(httpService.get).toHaveBeenCalledWith(url, { headers: { "Accept-Encoding": "gzip,deflate,compress" } });
      expect(result.data.message).toBe("Data fetched with error");
      expect(result.data.count).toBe(0);
    });
  });
});
