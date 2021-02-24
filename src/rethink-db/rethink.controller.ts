import { Controller, OnModuleInit } from '@nestjs/common';
import { RethinkService } from './rethink.service';

@Controller('rethink')
export class RethinkController {
  constructor(private readonly rethinkService: RethinkService) {}
}