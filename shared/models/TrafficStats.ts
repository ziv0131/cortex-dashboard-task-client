import z from 'zod';

export const trafficStatSchema = z.object({
  date: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    })
    .transform((val) => new Date(val)),
  visits: z.number().nonnegative().int(),
});

export const savedTrafficStatSchema = trafficStatSchema.extend({
  id: z.string().nonempty(),
});

export type TrafficStats = z.infer<typeof trafficStatSchema>;
export type SavedTrafficStats = z.infer<typeof savedTrafficStatSchema>;
