FROM node:20

#Working dir
WORKDIR /usr/src/app

#Copy package files
COPY package*.json ./

#Install files
RUN npm install

#Copy source files
COPY . .

#building
CMD ["node", "./src/index.js"]