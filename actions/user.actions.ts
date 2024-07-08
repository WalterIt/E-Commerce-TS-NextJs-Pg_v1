'use server'

import { isRedirectError } from 'next/dist/client/components/redirect'

import { signIn, signOut } from '@/auth'
import { signInFormSchema, signUpFormSchema } from '@/lib/validator'
import { hashSync } from 'bcrypt-ts-edge'
import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { formatError } from '@/lib/utils'


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