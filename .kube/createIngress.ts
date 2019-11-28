import Ingress from 'jskube/schema/ingress-extensions-v1beta1';

export interface Options {
  namespace: string;

  host: string;
  serviceName: string;
  enableTLS: boolean;
}
export default function createIngress({
  namespace,
  host,
  serviceName,
  enableTLS,
}: Options) {
  const secretName = `${host}-tls-secret`;
  const ingress: Ingress = {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    metadata: {
      name: host,
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
            paths: [{backend: {serviceName, servicePort: 80}}],
          },
        },
      ],
    },
  };
  const certificate = {
    apiVersion: 'cert-manager.io/v1alpha2',
    kind: 'Certificate',
    metadata: {
      name: host,
      namespace,
    },
    spec: {
      secretName,
      issuerRef: {
        name: 'letsencrypt-prod',
        kind: 'ClusterIssuer',
      },
      // commonName: host,
      dnsNames: [host],
    },
  };
  if (enableTLS) {
    console.info(
      `To check certificate status, run: kubectl describe certificate ${host} --namespace ${namespace}`,
    );
  }
  return [ingress, ...(enableTLS ? [certificate] : [])];
}
