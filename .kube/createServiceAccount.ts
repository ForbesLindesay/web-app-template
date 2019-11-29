import Namespace from 'jskube/schema/namespace-v1';
import ServiceAccount from 'jskube/schema/serviceaccount-v1';
import Role from 'jskube/schema/role-rbac-v1';
import RoleBinding from 'jskube/schema/rolebinding-rbac-v1';

// kubectl config view -o jsonpath='{.current-context}'
// # KUBERNETES_TOKEN=
// #   kubectl get secret $(kubectl get secret --namespace web-app-template | grep cicd-token | awk '{print $1}') --namespace web-app-template -o jsonpath='{.data.token}' | base64 --decode && echo ""
// # KUBERNETES_SERVER=
// #   kubectl config view -o jsonpath="{.clusters[?(@.name == \"`kubectl config view -o jsonpath='{.current-context}'`\")].cluster.server}" --raw && echo ""
// # KUBERNETES_CLUSTER_CERTIFICATE=
// #   kubectl config view -o jsonpath="{.clusters[?(@.name == \"`kubectl config view -o jsonpath='{.current-context}'`\")].cluster.certificate-authority-data}" --raw && echo ""

export default function createServiceAccount({namespace}: {namespace: string}) {
  const namespaceSpec: Namespace = {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: namespace,
    },
  };
  const serviceAccount: ServiceAccount = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name: 'cicd',
      namespace,
    },
  };
  const role: Role = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      name: 'cicd',
      namespace,
    },
    rules: [
      {
        apiGroups: ['', 'apps', 'batch', 'extensions'],
        resources: [
          'deployments',
          'services',
          'replicasets',
          'pods',
          'jobs',
          'cronjobs',
        ],
        verbs: ['*'],
      },
    ],
  };
  const roleBinding: RoleBinding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'RoleBinding',
    metadata: {
      name: 'cicd',
      namespace,
    },
    subjects: [{kind: 'ServiceAccount', name: 'cicd', namespace}],
    roleRef: {
      kind: 'Role',
      name: 'cicd',
      apiGroup: 'rbac.authorization.k8s.io',
    },
  };

  console.info(`To get the CI config:`);
  console.info(`  jskube get-env-vars --user cicd --namespace ${namespace}`);
  return [namespaceSpec, serviceAccount, role, roleBinding];
}
