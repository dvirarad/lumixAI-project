import {Test, TestingModule} from '@nestjs/testing';
import {WordCounterService} from './word-counter.service';
import {DbClientService} from '../db-client/db-client.service';
import {ConsoleLogger} from '@nestjs/common';

describe('WordCounterService', () => {
    let service: WordCounterService;
    let dbClientService: DbClientService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WordCounterService,
                {provide: DbClientService, useValue: {
                        ensureIndex: jest.fn(),
                        initializeUnorderedBulkOp: jest.fn(),
                        find: jest.fn(),
                    }},
                ConsoleLogger,
            ],
        }).compile();

        service = module.get<WordCounterService>(WordCounterService);
        dbClientService = module.get<DbClientService>(DbClientService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    describe('handle()', () => {
        it('should handle the input message and update the database', async () => {

            jest.spyOn(dbClientService, 'initializeUnorderedBulkOp').mockImplementation(() => Promise.resolve());

            jest.spyOn(dbClientService, 'ensureIndex').mockImplementation(() => Promise.resolve());

            jest.spyOn(console, 'log').mockImplementation(() => {
            });
            const msg = [
                ['word1', 'word2', 'word1'],
                ['word2', 'word3'],
            ];
            await service.handle(msg);

            // assert that the ensureIndex() method was called with the correct arguments
            expect(dbClientService.ensureIndex).toHaveBeenCalledWith('word-counter', {counter: 1});

            // assert that the initializeUnorderedBulkOp() method was called with the correct arguments
            const expectedBulkUpdateList = [
                {selector: {word: 'word1'}, updateDocument: {$inc: {counter: 2}}},
                {selector: {word: 'word2'}, updateDocument: {$inc: {counter: 2}}},
                {selector: {word: 'word3'}, updateDocument: {$inc: {counter: 1}}}
            ]
            expect(dbClientService.initializeUnorderedBulkOp).toHaveBeenCalledWith('word-counter', expectedBulkUpdateList);

        });

    });
    describe('getTop()', () => {
        it('should return the top n words and their counts from the database', async () => {
            const topNumber = 3;
            const mockData = [
                {word: 'word1', counter: 10, _id: '1'},
                {word: 'word2', counter: 8, _id: '2'},
                {word: 'word3', counter: 6,_id: '3'},
            ];
            //@ts-ignore
            jest.spyOn(dbClientService, 'find').mockImplementation(() => Promise.resolve(mockData));
            // jest.spyOn(dbClientService, 'find').mockResolvedValue(mockData);
            const result = await service.getTop(topNumber);

            // assert that the find method was called with the correct arguments
            expect(dbClientService.find).toHaveBeenCalledWith('word-counter', {}, {counter: -1}, topNumber);

            // assert that the result is an array of the correct format
            expect(result).toEqual([
                {word: 'word1', count: 10},
                {word: 'word2', count: 8},
                {word: 'word3', count: 6},
            ]);
        });
    });
});
