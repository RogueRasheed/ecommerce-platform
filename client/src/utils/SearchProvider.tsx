import {  useState, type ReactNode, } from "react";
import { SearchContext } from "./SearchContext";



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
