import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { DbClientModule } from './db-client/db-client.module';
import { WordCounterModule } from './word-counter/word-counter.module';

@Module({
  imports: [ AuditModule, DbClientModule, WordCounterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
