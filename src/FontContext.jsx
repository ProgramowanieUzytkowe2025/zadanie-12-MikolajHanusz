import React, { createContext, useState, useContext } from 'react';

const FontContext = createContext();

export const useFont = () => useContext(FontContext);

export const FontProvider = ({ children }) => {
  const [czcionka, setCzcionka] = useState('medium');

  return (
    <FontContext.Provider value={{ czcionka, setCzcionka }}>
      {children}
    </FontContext.Provider>
    
  );
};
