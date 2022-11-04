
FROM node:16.15.0

ENV NODE_ENV=production

## Image build steps
RUN apt-get -qq update \
    && apt-get install -y --no-install-recommends \
        g++

# Install packages
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

# Add source code
COPY . .

# enable gevent support in debugger
ENV GEVENT_SUPPORT=True

## Start the application
# ENTRYPOINT node main.js
CMD npm run start