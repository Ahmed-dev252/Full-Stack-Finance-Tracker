import { z } from 'zod';

export const transactionValidationSchema = z.object({
  title: z.string().min(1, 'Fadlan qor magaca lacagta').trim(),
  amount: z.number({ required_error: 'Cadadka lacagta waa lagama maarmaan' }),
  type: z.enum(['expense', 'income'], { errorMap: () => ({ message: 'Nooca lacagtu waa inay noqoto expense ama income' }) }),
  category: z.string().min(1, 'Qaybta lacagta waa lagama maarmaan').trim(),
  date: z.string().optional().transform((val) => val ? new Date(val) : new Date())
});
