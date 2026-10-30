# from base image node
FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g yarn

# copying dependency manifests first keeps installs reproducible and cacheable
COPY package.json yarn.lock ./

# install all dependencies
RUN yarn
RUN npm install -g nodemon

# copy oter files as well
COPY ./ .

EXPOSE 3001

# command to run when intantiate an image
CMD ["nodemon"]
