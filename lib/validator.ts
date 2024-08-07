import * as z from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants'
import { createInsertSchema} from 'drizzle-zod'
import { orderItems, orders } from '@/db/schema'

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

   // CART
   
   export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z
      .number()
      .int()
      .nonnegative('Quantity must be a non-negative number'),
    image: z.string().min(1, 'Image is required'),
    price: z
      .number()
      .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
        'Price must have exactly two decimal places (e.g., 49.99)'
      ),
  })

  export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 Characters!'),
    streetAddress: z.string().min(3, 'Address must be at least 3 Characters!'),
    city: z.string().min(3, 'city must be at least 3 Characters!'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 Characters!'),
    country: z.string().min(3, 'Country must be at least 3 Characters!'),
    lat: z.number().optional(),
    lng: z.number().optional(),
  })


  export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment Method is Required!'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid Payment Method!',
  })

  export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
  })
  
  export const insertOrderSchema = createInsertSchema(orders, {
    shippingAddress: shippingAddressSchema,
    paymentResult: z
      .object({
        id: z.string(),
        status: z.string(),
        email_address: z.string(),
        pricePaid: z.string(),
      })
      .optional(),
  })
  
  export const insertOrderItemSchema = createInsertSchema(orderItems, {
    price: z.number(),
  })


  export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 Characters!'),
    email: z.string().email().min(3, 'Email must be at least 3 Characters!'),
  })