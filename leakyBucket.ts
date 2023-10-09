import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

const windowSize = 1000 * 60; // 1 minute window in milliseconds
const maxRequestsPerWindow = 10; // 10 requests per window size
const requestQueue: number[] = [];
const tokenRate = 10; // Tokens added per millisecond
let currentTokens = 0;
let lastUpdateTime = Date.now();

function refillTokens(): void {
  const now = Date.now();
  const timePassed = now - lastUpdateTime;
  lastUpdateTime = now;
  const tokensToAdd = timePassed * tokenRate;
  currentTokens = Math.min(currentTokens + tokensToAdd, maxRequestsPerWindow);
}

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  refillTokens();

  if (currentTokens < 1) {
    res.status(429).send("Rate limit exceeded");
  } else {
    currentTokens--;
    next();
  }
}

app.use(rateLimitMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
