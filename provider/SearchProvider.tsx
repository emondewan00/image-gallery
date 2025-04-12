"use client";
import { createContext, useState, ReactNode, useContext } from "react";

// Define the context type
interface SearchContextType {
  search: string;
  setSearch: (search: string) => void;
}

// Create context with initial value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Define provider props
interface SearchProviderProps {
  children: ReactNode;
}

// Create provider component
export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// Create custom hook for consuming context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
