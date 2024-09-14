FROM node:20 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . .
EXPOSE 4444
CMD ["npm", "start"]
