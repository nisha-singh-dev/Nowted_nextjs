
"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import MiddleList from "@/components/MiddleList/MiddleList";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Box, CssBaseline } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "black"}}>
        <CssBaseline />
        <QueryProvider>
          <Box display="flex" height="100dvh">
            <Sidebar />
            <MiddleList />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              {children}
            </Box>
          </Box>
        </QueryProvider>
      </body>
    </html>
  );
}
