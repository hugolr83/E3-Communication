FROM alpine 
RUN apk add --update nodejs npm

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
COPY package-lock.json ./

RUN npm install prettier -g


RUN npm install
COPY . ./


# Expose on port 5000
EXPOSE 5000


CMD ["npm", "start"]
