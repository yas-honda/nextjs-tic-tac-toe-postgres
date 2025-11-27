import { sql } from '@vercel/postgres';

// In a real Vercel environment, this helper is often used to centralize 
// DB logic or handle specific connection pooling configs if needed.
// For this simple app, we just re-export sql or add logging.

export { sql };
