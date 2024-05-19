import {z} from 'zod';

export const userSchema = z.object({
  _id: z.string(),
  username: z.string().min(2).max(16),
  password: z.string().min(4).max(32),
});

export const userCreationSchema = userSchema.omit({
  _id: true,
});
