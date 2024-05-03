"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "@/styles/unreset.css"

import { Toaster } from "react-hot-toast"

export function AdminProviders({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        toastOptions={{
          className:
            "!bg-secondary/50 !text-foreground backdrop-blur-lg saturate-150",
        }}
      />
    </QueryClientProvider>
  )
}
