FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk add --no-cache openssl

FROM base AS dependencies
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm prisma generate
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]