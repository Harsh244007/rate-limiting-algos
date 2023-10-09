import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

const windowSize = 1000 * 60; // 1 minute window in milliseconds
const maxRequestsPerWindow = 10; // 10 requests per window size
const requestQueue: number[] = [];

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const currentTime = Date.now();

  while (requestQueue.length > 0 && requestQueue[0] < currentTime - windowSize) {
    requestQueue.shift();
  }

  if (requestQueue.length >= maxRequestsPerWindow) {
    res.status(429).send("Rate limit exceeded");
  } else {
    requestQueue.push(currentTime);
    next();
  }
}

app.use(rateLimitMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
