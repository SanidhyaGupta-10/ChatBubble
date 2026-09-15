FROM oven/bun:1.2.14 AS web-deps
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

FROM web-deps AS web-build
COPY web/ ./
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

FROM oven/bun:1.2.14 AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

FROM backend-deps AS backend-build
COPY backend/ ./
RUN bunx prisma generate

FROM oven/bun:1.2.14 AS runtime
WORKDIR /app

COPY --from=backend-build /app/backend /app/backend
COPY --from=web-build /app/web/dist /app/web/dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "-r", "dotenv/config", "backend/server.ts"]
