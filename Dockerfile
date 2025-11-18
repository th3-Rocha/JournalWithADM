FROM node:16.20.0

WORKDIR /var/www/frontend

COPY ["package.json", "./"]

COPY . .

RUN yarn install --network-timeout 60000000

# RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]
