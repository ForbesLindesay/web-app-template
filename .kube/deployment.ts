import createDeployment from './createDeployment';

if (!['staging', 'production'].includes(process.env.ENVIRONMENT)) {
  console.error(
    'ENVIRONMENT should be set to either "staging" or "production"',
  );
  process.exit(1);
}

export default createDeployment({
  namespace: 'web-app-template',
  name: 'web-app-template-' + process.env.ENVIRONMENT,
  containerPort: 3000,
  replicaCount: 2,
  image: `${process.env.DOCKERHUB_USERNAME}/web-app-template:${process.env.CIRCLE_SHA1}`,
});
