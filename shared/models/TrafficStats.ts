import z, { isValid } from 'zod';

export const trafficStatSchema = z.object({
  date: z.coerce.date(),
  visits: z.number().nonnegative().int(),
});

export const savedTrafficStatSchema = trafficStatSchema.extend({
  id: z.string().nonempty(),
});

export type TrafficStats = z.infer<typeof trafficStatSchema>;
export type SavedTrafficStats = z.infer<typeof savedTrafficStatSchema>;
