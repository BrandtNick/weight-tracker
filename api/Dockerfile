# from base image node
FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

# copying all the files from your file system to container file system
COPY package.json .

# install all dependencies
RUN yarn
RUN npm install -g nodemon

# copy oter files as well
COPY ./ .

EXPOSE 3001

# command to run when intantiate an image
CMD ["nodemon"]
