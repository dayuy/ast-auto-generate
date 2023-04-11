function getCode(kind, k8sCR) {
  return `
    @Injectable()
    export class ${kind}Service {
      constructor(private readonly k8sService: KubernetesService) {}
    
      format(cr: ${k8sCR}): ${kind} {
        return {
          name: cr.metadata?.name,
          namespace: cr.metadata?.namespace,
        };
      }
    
      async getCR(auth: JwtAuth, name: string, namespace: string): Promise<${kind}> {
        const k8s = await this.k8sService.getClient(auth);
        const { body } = await k8s.${kind.toLowerCase()}.read(name, namespace);
        return this.format(body);
      }
    
      async getCRs(auth: JwtAuth, namespace: string): Promise<${kind}[]> {
        const k8s = await this.k8sService.getClient(auth);
        const { body } = await k8s.${kind.toLowerCase()}.list(namespace);
        return body.items.map((d) => this.format(d));
      }
    }
  `
}

function getImportSpecs(kind) {
  return [
    { names: ['Injectable'], source: '@nestjs/common' },
    { names: ['KubernetesService'], source: 'src/kubernetes/kubernetes.service' },
    { names: ['JwtAuth', 'K8s'], source: 'src/types' },
    { names: [kind], source: `./models/${kind.toLowerCase()}.model` },
  ]
}

module.exports = {
  getCode,
  getImportSpecs,
}
