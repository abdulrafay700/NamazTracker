import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context banana
const LocationContext = createContext<any>(null); 

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState({ city: 'KARACHI', country: 'PK' });

  return (
    // Yahan LocationContext use ho raha hai
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext); // Yahan bhi wahi naam aayega
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
// File ke bilkul end mein ye add karein:
export default function LocationContextDummy() {
  return null;
}