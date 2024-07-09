'use server'

import { isRedirectError } from 'next/dist/client/components/redirect'

import { auth, signIn, signOut } from '@/auth'
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema } from '@/lib/validator'
import { hashSync } from 'bcrypt-ts-edge'
import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { formatError } from '@/lib/utils'
import { ShippingAddress } from '@/types'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'


export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    })

    const values = {
      id: crypto.randomUUID(),
      ...user,
      password: hashSync(user.password, 10),
    }

    await db.insert(users).values(values)

    await signIn('credentials', {
      email: user.email,
      password: user.password,
    })

    return { success: true, message: 'User Created Successfully!' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? 'Email  Already Exists!'
        : formatError(error),
    }
  }
}



export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    await signIn('credentials', user)
    return { success: true, message: 'Sign In Successfully!' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid Email or Password!' }
  }
}

export const SignOut = async () => {
  await signOut()
}


export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
  if (!user) throw new Error('User Not Found!')
  return user
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth()
    const currentUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    })
    if (!currentUser) throw new Error('User Not Found!')

    const address = shippingAddressSchema.parse(data)
    await db
      .update(users)
      .set({ address })
      .where(eq(users.id, currentUser.id))

    revalidatePath('/place-order')
    
    return {
      success: true,
      message: 'User Updated Successfully!',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth()
    const currentUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    })

    if (!currentUser) throw new Error('User Not Found!')
    const paymentMethod = paymentMethodSchema.parse(data)

    await db
      .update(users)
      .set({ paymentMethod: paymentMethod.type })
      .where(eq(users.id, currentUser.id))

    revalidatePath('/place-order')

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}


// UPDATE PROFILE


export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth()
    const currentUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session?.user.id!),
    })

    if (!currentUser) throw new Error('User Not Found!')

    await db
      .update(users)
      .set({
        name: user.name,
      })
      .where(and(eq(users.id, currentUser.id)))

    return {
      success: true,
      message: 'User Updated Successfully!',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}