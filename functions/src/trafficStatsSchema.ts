import z from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const trafficStatSchema = z.object({
  date: z.string().regex(dateRegex),
  visits: z.number().min(0),
});
