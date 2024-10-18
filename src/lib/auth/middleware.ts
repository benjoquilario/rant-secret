import * as z from "zod"

export type ActionState = {
  error?: string
  success?: string
  [key: string]: any // This allows for additional properties
}

type ValidatedActionFunction<V extends z.ZodType<any, any>, T> = (
  data: z.infer<V>,
  formData: FormData
) => Promise<T>

export function validatedAction<V extends z.ZodType<any, any>, T>(
  schema: V,
  action: ValidatedActionFunction<V, T>
) {
  return async (formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
      return { error: result.error.errors[0].message } as T
    }

    return action(result.data, formData)
  }
}
