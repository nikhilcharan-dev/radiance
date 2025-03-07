import "./globals.css";
import { ReactNode } from "react";
import {ThemeProvider} from "@/context/Theme/theme";
import Navbar from "@/components/navigationbar/Navbar";
import Background from "@/components/background/background";

export default function Layout({ children } :{
  children: ReactNode
}) {
    return (
        <html>
            <body>
                <ThemeProvider>
                    <Navbar />
                    <Background/>
                        <div>
                            {children}
                        </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
