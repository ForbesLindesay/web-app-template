FROM node:12-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --production --frozen-lockfile \
  && yarn cache clean

COPY lib /app/lib

CMD node /app/lib