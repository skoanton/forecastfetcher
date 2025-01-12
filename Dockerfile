FROM node:latest

RUN apt-get update && apt-get install -y tzdata
# Set the timezone
ENV TZ=Europe/Stockholm
# Create app directory
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

CMD ["node", "index.js"]
