# Next.js portfolio — build the app, then serve it with `next start`.
# Unlike growix there is no database/migration step, so a plain build+start is enough.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "--", "-p", "3000"]
