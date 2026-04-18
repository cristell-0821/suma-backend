import { Module } from '@nestjs/common';
import { DisabilitiesController } from './disabilities.controller';

@Module({
  controllers: [DisabilitiesController],
})
export class DisabilitiesModule {}