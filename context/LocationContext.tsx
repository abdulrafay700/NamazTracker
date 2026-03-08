// LocationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

const LocationContext = createContext<any>(null); 

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  // Shuru mein hum khali chor sakte hain ya default rakh sakte hain
  const [location, setLocation] = useState({ city: 'Loading...', country: '..' });

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};

export default function LocationContextDummy() { return null; }