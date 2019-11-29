import Ingress from 'jskube/schema/ingress-extensions-v1beta1';

export interface Options {
  name: string;
  namespace: string;

  host: string;
  serviceName?: string;
  enableTLS: boolean;
}
export default function createIngress({
  name,
  namespace,

  host,

  serviceName,
  enableTLS,
}: Options) {
  const secretName = `${name}-tls-secret`;
  const ingress: Ingress = {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    metadata: {
      name,
      namespace,
    },
    spec: {
      ...(enableTLS
        ? {
            tls: [{hosts: [host], secretName}],
          }
        : {}),
      rules: [
        {
          host,
          http: {
            paths: [
              {backend: {serviceName: serviceName || name, servicePort: 80}},
            ],
          },
        },
      ],
    },
  };
  const certificate = {
    apiVersion: 'cert-manager.io/v1alpha2',
    kind: 'Certificate',
    metadata: {
      name,
      namespace,
    },
    spec: {
      secretName,
      issuerRef: {
        name: 'letsencrypt-prod',
        kind: 'ClusterIssuer',
      },
      dnsNames: [host],
    },
  };
  if (enableTLS) {
    console.info(
      `To check certificate status, run: kubectl describe certificate ${name} --namespace ${namespace}`,
    );
  }
  return [ingress, ...(enableTLS ? [certificate] : [])];
}
