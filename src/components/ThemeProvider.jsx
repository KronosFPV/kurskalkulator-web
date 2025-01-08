import React, { useState, useEffect } from 'react';

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true); // Standardmäßig dark mode

  useEffect(() => {
    // Immer dark mode aktivieren
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
};

export default ThemeProvider;
