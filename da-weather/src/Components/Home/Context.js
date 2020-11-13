import React, { useState, createContext } from "react";

// Create Context Object
export const StationContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const StationContextProvider = props => {
  const [Station, setStation] = useState(1);

  return (
    <StationContext.Provider value={[Station, setStation]}>
      {props.children}
    </StationContext.Provider>
  );
};