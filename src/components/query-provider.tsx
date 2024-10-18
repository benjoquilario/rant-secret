"use client"
import React, { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

type QueryProviderProps = {
  children: React.ReactNode
}

const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default QueryProvider
