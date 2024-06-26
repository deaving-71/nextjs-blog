"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { errorHandler } from "@/lib/actions/client/error-handler"
import { useSignIn } from "@/hooks/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter a valid password."),
  remember: z.boolean().default(false),
})

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const router = useRouter()

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      toast.success("Successfully logged in", { duration: 2000 })
      router.push("/admin")
    },
    onError: (err) => {
      errorHandler(err, ({ errors }) => {
        for (let key in errors.fieldErrors) {
          const message = errors.fieldErrors[key][0]
          if (key === "root") form.setError(`root`, { message })
          form.setError(`root.${key}`, { message })
        }
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isPending) return
    signIn(values)
  }

  return (
    <div className="w-[450px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border p-5"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl  font-medium">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground">
              Please enter your email and password to sign in
            </p>
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="mt-2 flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="remember-me">Remember me</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-base"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? (
              <span className="*:inline">Signing in...</span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
