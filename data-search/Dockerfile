FROM node:16

WORKDIR /usr/src/app

COPY  package.json /usr/src/app

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]
