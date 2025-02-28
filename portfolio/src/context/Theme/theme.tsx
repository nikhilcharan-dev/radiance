"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface themeContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export const ThemeContext = createContext<themeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

// Creating a Functional Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<"light" | "dark">('dark');
    
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.classList.toggle("dark-mode", theme === "dark");
        document.body.classList.toggle("light-mode", theme === "light");
    }, [theme]);
    
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    }
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};