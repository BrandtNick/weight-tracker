import {z} from 'zod';
import {ObjectId} from 'mongodb';

export const weightSchema = z
  .object({
    _id: z.string(),
    weight: z.number().positive(),
    timestamp: z.date(),
    metadata: z.object({
      user: z
        .string()
        .refine((value) => ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        }),
    }),
  })
  .strict();

export const weightCreationSchema = weightSchema
  .omit({
    _id: true,
    metadata: true,
  });
