import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ComponentplanService } from './componentplan.service';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { ComponentplanArgs } from './dto/componentplan.args';

@Resolver(() => Componentplan)
export class ComponentplanResolver {
  constructor(private readonly componentplanService: ComponentplanService) {}

  @Query(() => PaginatedComponentplan, { description: '列表（分页）' })
  async componentplansPaged(
    @Auth() auth: JwtAuth,
    @Args() args: ComponentplanArgs,
  ): Promise<PaginatedComponentplan> {
    return this.componentplanService.listPaged(auth, args);
  }

  @Query(() => Componentplan, { description: '详情' })
  async componentplan(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Componentplan> {
    return this.componentplanService.get(auth, name, namespace, cluster);
  }

  @Mutation(() => Componentplan, { description: '创建' })
  async componentplanCreate(
    @Auth() auth: JwtAuth,
    @Args('namespace') namespace: string,
    @Args('componentplan') componentplan: CreateComponentplanInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Componentplan> {
    return this.componentplanService.create(auth, namespace, componentplan, cluster);
  }

  @Mutation(() => Componentplan, { description: '更新' })
  async componentplanUpdate(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('componentplan') componentplan: UpdateComponentplanInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ) {
    return this.componentplanService.update(auth, name, namespace, componentplan, cluster);
  }

  @Mutation(() => Boolean, { description: '删除' })
  async componentplanRemove(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.componentplanService.remove(auth, name, namespace, cluster);
  }
}
