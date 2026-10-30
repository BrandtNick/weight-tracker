FROM node:lts-alpine

RUN mkdir -p /app

WORKDIR /app

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

EXPOSE 3000

CMD [ "yarn", "dev" ]
