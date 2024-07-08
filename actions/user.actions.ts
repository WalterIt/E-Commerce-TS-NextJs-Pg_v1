'use server'

import { isRedirectError } from 'next/dist/client/components/redirect'

import { signIn, signOut } from '@/auth'
import { signInFormSchema } from '@/lib/validator'

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