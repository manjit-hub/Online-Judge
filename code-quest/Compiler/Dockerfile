FROM node:18-alpine
WORKDIR /CompilerDocker
# Install dependencies
RUN apk update && apk add --no cache g++
#Caching
COPY package.json .
RUN npm install

COPY . .
# EXPOSE PORTS
EXPOSE 8000
CMD ["node", "compiler.js"]