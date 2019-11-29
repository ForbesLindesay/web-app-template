import createIngress from './createIngress';
import createServiceAccount from './createServiceAccount';

export default [
  ...createServiceAccount({namespace: 'web-app-template'}),
  ...createIngress({
    name: 'web-app-template-staging',
    namespace: 'web-app-template',
    serviceName: 'web-app-template-staging',
    host: 'web-app-template.staging.makewebtech.org',
    enableTLS: true,
  }),
  ...createIngress({
    name: 'web-app-template-production',
    namespace: 'web-app-template',
    serviceName: 'web-app-template-production',
    host: 'web-app-template.makewebtech.org',
    enableTLS: true,
  }),
];
