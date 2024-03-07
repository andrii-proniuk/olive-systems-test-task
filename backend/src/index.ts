import 'dotenv/config';
import { ClerkExpressWithAuth, StrictAuthProp } from '@clerk/clerk-sdk-node';
import express, { Request, Response } from 'express';
import { Clerk } from '@clerk/backend';
import cors from 'cors';

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const PORT = process.env.PORT && parseInt(process.env.PORT) || 3000;

const app = express();

app.use(cors());

app.get('/me', ClerkExpressWithAuth(), async (req: Request, res: Response): Promise<any> => {
  if (!req.auth?.userId) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const { userId } = req.auth;

  const user = await clerk.users.getUser(userId);

  res.json({ id: user.id, email: user.emailAddresses[0].emailAddress });
});

app.use((req, res) => {
  res.status(404).json({
    message: `Page '${req.path}' not found`,
  });
});

app.listen(PORT, () => {
  console.log('server started on port', PORT);
});
