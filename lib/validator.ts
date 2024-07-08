import * as z from 'zod'

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(2, 'Email must be at least 2 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
})