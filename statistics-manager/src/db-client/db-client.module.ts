import {ConsoleLogger, Module} from '@nestjs/common';
import { DbClientService } from './db-client.service';

@Module({
  providers: [DbClientService,ConsoleLogger],
  exports: [DbClientService],
})
export class DbClientModule {}
