import { SortDirection } from '@/common/models/sort-direction.enum';
import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/models/pagination.args';

@ArgsType()
export class ComponentplanArgs extends PaginationArgs {
  /** 名称 */
  name?: string;

  /** 项目 */
  namespace: string;

  /** 排序方向 */
  @Field(() => SortDirection, { description: `排序方向` })
  sortDirection?: SortDirection;

  /** 排序字段 */
  @Field(() => String, { description: `排序字段` })
  sortField?: 'creationTimestamp';

  /** 集群（不传则为默认集群） */
  cluster?: string;
}