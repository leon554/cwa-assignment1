FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 80
CMD ["sh", "-c", "npx prisma db push && npm run dev"]