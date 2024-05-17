FROM public.ecr.aws/docker/library/node:20.9.0-alpine3.17

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

RUN npm run build

CMD ["node", "dist/src/index.js"]