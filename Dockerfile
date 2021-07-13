FROM node:alpine

LABEL com.github.actions.name="at-merge-dependabot" \
      maintainer="Joshua Smock <jo-sm@users.noreply.github.com>" \
      testing="true"

RUN mkdir /action
COPY src package.json package-lock.json /action/
WORKDIR /action

RUN npm ci --only=prod

ENTRYPOINT ["node", "/action/index.js"]
