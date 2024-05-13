import React from "react";
import NextTopLoader from "nextjs-toploader";

import { env } from "@/env.mjs";
import { ScreenSize } from "@/components/ui/screen-size-indicator";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/modals";
import { TRPCReactProvider } from "@/trpc/client";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <NextTopLoader
            color="#2247dd"
            initialPosition={0.08}
            crawlSpeed={170}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2247dd,0 0 5px #2247dd"
          />
          {env.NODE_ENV === "development" && <ScreenSize />}
          {children}
          <ModalProvider />
          <Toaster richColors duration={2700} />
        </ThemeProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
};

export default Providers;
