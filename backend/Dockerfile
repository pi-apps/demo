FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

# When building for production, use the lockfile as-is:
RUN yarn install --frozen-lockfile
# RUN npm ci --only=production

# Bundle app source
# TODO make this only copy the necessary files instead of copying the whole directory
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN yarn build

RUN yarn global add pm2
COPY ./docker/processes.config.js ./processes.config.js

RUN mkdir -p log && touch log/.keep

EXPOSE 8080
CMD [ "pm2-runtime", "./processes.config.js" ]

# CMD [ "pm2-runtime", "build/index.js" ]
# CMD [ "node", "build/index.js" ]
