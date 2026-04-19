FROM node:22.22.1-alpine

WORKDIR /usr/local/app

RUN apk update && \
    #npm i -g pnpm && \
    apk add --no-cache \
      imagemagick \
      imagemagick-dev \
      pixman-dev \
      librsvg \
      build-base \
      g++ \
      cairo-dev \
      jpeg-dev \
      pango-dev \
      make \
      python3 \
      ttf-dejavu \
      ttf-liberation \
      font-noto \
      font-noto-cjk \
      font-noto-emoji \
      giflib-dev && \
      npm install --build-from-source canvas




#COPY package*.json pnpm-lock.yaml ./
COPY package*.json ./

#RUN pnpm install --frozen-lockfile
RUN npm install

COPY . .

ENTRYPOINT ["npm","run","dev"]
