import * as z from 'zod'

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(2, 'Email must be at least 2 Characters!'),
  password: z.string().min(3, 'Password must be at least 3 Characters!'),
})

export const signUpFormSchema = z
.object({
  name: z.string().min(2, 'Name must be at least 2 Characters!'),
  email: z.string().min(3, 'Email must be at least 3 Characters!'),
  password: z.string().min(3, 'Password must be at least 3 Characters!'),
  confirmPassword: z
    .string()
    .min(3, 'Confirm password must be at least 3 Characters!'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't Match!",
  path: ['confirmPassword'],
})