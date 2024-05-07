import {z} from 'zod';

const createWeightSchema = z.object({
  weight: z.number().int().positive(),
});

export {
  createWeightSchema,
};
