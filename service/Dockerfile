FROM node:11

WORKDIR /usr/src/app

COPY package*.json ./
COPY bin ./bin/
COPY lib ./lib/

RUN npm install

CMD ["npm", "start"]