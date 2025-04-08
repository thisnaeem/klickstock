'use client';

import React from "react"
import { SessionProvider } from "next-auth/react"
import { ReduxProvider } from "@/redux/provider"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  )
}

export default Providers
