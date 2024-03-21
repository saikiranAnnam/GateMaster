## Install dependencies

```bash
npm install argon2 drizzle-orm pg pino pino-pretty zennv zod jsonwebtoken fastify-zod fastify-guard fastify
```

## Install dev dependencies
```bash
npm install  zod-to-json-schema @types/jsonwebtoken typescript tsx drizzle-kit @types/pg -D
```
## Initialize TypeScript
```bash
npx tsc --init
```

## Run migrations
```bash
npm run migrate
```

## Run the application
```bash
npm run dev
```