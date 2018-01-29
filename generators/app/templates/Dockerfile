FROM node:8

EXPOSE 8080

WORKDIR /usr/src/app

COPY .npmrc package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "local"]
