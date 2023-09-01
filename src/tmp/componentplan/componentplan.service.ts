import { Injectable } from '@nestjs/common';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';
import { CRD, JwtAuth } from '@/types';
import { ComponentplanArgs } from './dto/componentplan.args';
import { SortDirection } from '@/common/models/sort-direction.enum';
import { genNanoid } from '@/common/utils';

@Injectable()
export class ComponentplanService {
  constructor(
    private readonly k8sService: KubernetesService,
  ) {}

  format(c: CRD.ComponentPlan): Componentplan {
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
    };
  }

  async list(
    auth: JwtAuth,
    namespace: string,
    cluster?: string,
  ): Promise<Componentplan[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.list(namespace);
    return body.items
      ?.map(t => this.format(t))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async get(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<Componentplan> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.read(name, namespace);
    return this.format(body);
  }

  async listPaged(
    auth: JwtAuth,
    args: ComponentplanArgs
  ): Promise<PaginatedComponentplan> {
    const { page, pageSize, name, sortDirection, sortField, cluster, namespace } = args;
    const res = await this.list(auth, namespace, cluster);
    const filteredRes = res?.filter(
      t => (!name || t.name?.includes(name))
    );
    if (sortField && sortDirection) {
      filteredRes?.sort((a, b) => {
        if (sortField === 'creationTimestamp') {
          const [aT, bT] = [new Date(a.creationTimestamp).valueOf(), new Date(b.creationTimestamp).valueOf()];
          return sortDirection === SortDirection.ascend ? aT - bT : bT - aT;
        }
      });
    }
    const totalCount = filteredRes.length;
    return {
      totalCount,
      hasNextPage: page * pageSize < totalCount,
      nodes: filteredRes.slice((page - 1) * pageSize, page * pageSize),
    };
  }

  async create(
    auth: JwtAuth,
    namespace: string,
    componentplan: CreateComponentplanInput,
    cluster?: string
  ): Promise<Componentplan> {
    const { displayName } = componentplan;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.create(namespace, {
      metadata: {
        name: genNanoid('componentplan'),
        annotations: {
          displayName
        }
      },
    });
    return this.format(body);
  }

  async update(
    auth: JwtAuth,
    name: string,
    namespace: string,
    componentplan: UpdateComponentplanInput,
    cluster?: string,
  ): Promise<Componentplan> {
    const { displayName } = componentplan;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.patchMerge(name, namespace, {
      metadata: {
        annotations: {
          displayName
        }
      },
    });
    return this.format(body);
  }

  async remove(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string,
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.componentplan.delete(name, namespace);
    return true;
  }
}
