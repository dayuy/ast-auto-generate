import { Module } from '@nestjs/common';
import { ComponentplanService } from './componentplan.service';
import { ComponentplanResolver } from './componentplan.resolver';

@Module({
  providers: [ComponentplanResolver, ComponentplanService]
})
export class ComponentplanModule {}
