import Service from 'jskube/schema/service-v1';
import Deployment from 'jskube/schema/deployment-apps-v1';

export interface Options {
  namespace: string;
  name: string;

  replicaCount: number;
  containerPort: number;
  image: string;
}
// # Check deployment rollout status every 10 seconds (max 10 minutes) until complete.
// ATTEMPTS=0
// ROLLOUT_STATUS_CMD="kubectl rollout status deployment/myapp -n namespace"
// until $ROLLOUT_STATUS_CMD || [ $ATTEMPTS -eq 60 ]; do
//   $ROLLOUT_STATUS_CMD
//   ATTEMPTS=$((attempts + 1))
//   sleep 10
// done
export default function createDeployment({
  namespace,
  name,
  containerPort,
  replicaCount,
  image,
}: Options) {
  const service: Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name,
      namespace,
    },
    spec: {
      ports: [{port: 80, targetPort: containerPort}],
      selector: {app: name},
    },
  };
  const deployment: Deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name,
      namespace,
    },
    spec: {
      selector: {
        matchLabels: {
          app: name,
        },
      },
      replicas: replicaCount,
      template: {
        metadata: {
          labels: {
            app: name,
          },
        },
        spec: {
          containers: [
            {
              name: name,
              image,
              ports: [{containerPort}],
            },
          ],
        },
      },
    },
  };
  console.info(
    `To watch this deployment, run: kubectl rollout status deployment/${name} --namespace ${namespace}`,
  );
  return [service, deployment];
}