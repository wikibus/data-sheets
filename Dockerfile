FROM node:lts-alpine AS builder

WORKDIR /
ADD . .

RUN npm ci

ENV NODE_ENV=production
RUN npm run build

FROM node:lts-alpine

COPY --from=builder /package.json ./package.json
COPY --from=builder /package-lock.json ./package-lock.json
RUN npm ci --only=production

COPY --from=builder /dist ./

EXPOSE $PORT

CMD ["node", "index.js"]
