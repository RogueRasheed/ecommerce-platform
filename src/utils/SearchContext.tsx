import { createContext, useContext, useState, type ReactNode, } from "react";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
