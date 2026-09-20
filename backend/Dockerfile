FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY schema ./schema/
COPY prisma.config.ts ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=schema/schema.prisma

EXPOSE 5000

CMD ["npm", "run", "dev"]