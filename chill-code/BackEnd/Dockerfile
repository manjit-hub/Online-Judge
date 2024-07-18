FROM node:18-alpine
WORKDIR /BackendDocker
#Caching
COPY package.json .
RUN npm install

COPY . .
# EXPOSE PORTS
EXPOSE 5000
CMD ["node", "backend.js"]