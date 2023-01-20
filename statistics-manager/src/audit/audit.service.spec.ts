import {AuditService} from "./audit.service";
import {DbClientService} from "../db-client/db-client.service";
import {ConsoleLogger} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {WordCounterService} from "../word-counter/word-counter.service";


describe('AuditService', () => {
    let service: AuditService;
    let dbClientService: DbClientService;
    let logger: ConsoleLogger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditService,
                {provide: DbClientService, useValue: {
                        find: jest.fn(),
                    }},
                ConsoleLogger,
            ],
        }).compile();

        service = module.get<AuditService>(AuditService);
        dbClientService = module.get<DbClientService>(DbClientService);
    });

    it('find() should return correct data and count', async () => {
        const filter = { startTime: 123, endTime:128 };
        // @ts-ignore
        jest.spyOn(dbClientService, 'find').mockReturnValue(() => expectedData);

        const result = await service.find(filter);

        expect(dbClientService.find).toHaveBeenCalledWith('audit', { created_at: { $gte: 123, $lte: 128 } });
    });
});
