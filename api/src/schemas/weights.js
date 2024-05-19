import {z} from 'zod';

export const weightSchema = z
  .object({
    _id: z.string(),
    weight: z.number().positive(),
    timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    metadata: z.object({
      user: z.string().min(2).max(16),
    }),
  })
  .strict();

export const weightCreationSchema = weightSchema
  .omit({
    _id: true,
    timestamp: true,
  });
