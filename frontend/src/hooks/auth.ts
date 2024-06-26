import { MutationOptions, useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"

type Credentials = {
  email: string
  password: string
  remember: boolean
}

const authCheckSchema = z.object({
  isAuthenticated: z.boolean(),
})

export function useSignIn(opts?: MutationOptions<void, Error, Credentials>) {
  return useMutation({
    mutationKey: ["auth", "sign_in"],
    mutationFn: async (credentials: Credentials) => {
      await fetcher(`/auth/sign-in`, {
        method: "POST",
        body: credentials,
      })
    },
    ...opts,
  })
}

export function useSignOut(opts?: MutationOptions) {
  return useMutation({
    mutationKey: ["auth", "sign_out"],
    mutationFn: async () => {
      await fetcher("/auth/sign-out", { method: "DELETE" })
    },
    ...opts,
  })
}

export function useCheckAuthentication() {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      const result = await fetcher("/auth")
      return authCheckSchema.parse(result)
    },
    retry: 2,
    throwOnError: true,
  })
}
