import { Paginated } from '@/common/models/paginated.function';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Componentplan {
  @Field(() => ID, { description: '组件名称' })
  name: string;

  /** 创建时间 */
  creationTimestamp: string;
}

@ObjectType({ description: '分页' })
export class PaginatedComponentplan extends Paginated(Componentplan) {}
