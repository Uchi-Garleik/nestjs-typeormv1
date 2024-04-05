FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 300

CMD ["npm", "run", "start:dev"]
