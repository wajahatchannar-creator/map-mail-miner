import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-card rounded-xl shadow-elegant p-6 border border-border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Business Data Scraper
          </h1>
          <p className="text-muted-foreground">
            Search for businesses on Google Maps and export the data
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., pizza restaurants in Los Angeles, CA"
              className="pl-10 h-12 text-base"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Businesses
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};