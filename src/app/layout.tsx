import type { Metadata } from "next";
import { TRPCProvider } from "./providers";

export const metadata: Metadata = {
  title: "RPC Implementation — tRPC Demo",
  description: "Distributed Networks: Remote Procedure Call with tRPC + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0a", color: "#ededed" }}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
