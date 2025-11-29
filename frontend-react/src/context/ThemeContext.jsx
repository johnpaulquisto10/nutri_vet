import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return 'light'; // Default to light
    });

    useEffect(() => {
        const root = document.documentElement;

        // Remove both classes first
        root.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(theme);

        // Apply inline styles with cssText to use !important
        if (theme === 'dark') {
            root.style.cssText = 'background-color: #111827 !important; color: #f9fafb !important;';
            document.body.style.cssText = 'background-color: #111827 !important; color: #f9fafb !important; margin: 0; padding: 0;';
        } else {
            root.style.cssText = 'background-color: #f9fafb !important; color: #1f2937 !important;';
            document.body.style.cssText = 'background-color: #f9fafb !important; color: #1f2937 !important; margin: 0; padding: 0;';
        }

        // Save to localStorage
        localStorage.setItem('theme', theme);

        // Enhanced debug
        console.log('✅ Theme changed to:', theme);
        console.log('✅ HTML class:', root.className);
        console.log('✅ Computed body bg:', window.getComputedStyle(document.body).backgroundColor);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const setLightTheme = () => setTheme('light');
    const setDarkTheme = () => setTheme('dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setLightTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
