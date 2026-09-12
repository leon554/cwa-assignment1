FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# npm ci fails here: the lockfile is written by a newer local npm than
# the Alpine image, so optional native packages such as @emnapi/* are missing.
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]