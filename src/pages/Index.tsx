import { useState } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { BusinessCard, Business } from '@/components/BusinessCard';
import { EmailExportForm } from '@/components/EmailExportForm';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setBusinesses([]);

    try {
      const results = await ApiService.searchBusinesses(query);
      setBusinesses(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No businesses found for your search query.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} business${results.length !== 1 ? 'es' : ''}`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleExport = async (email: string, data: Business[]) => {
    await ApiService.exportData(email, data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} isLoading={isSearching} />
        
        {businesses.length > 0 && (
          <div className="space-y-8">
            <EmailExportForm 
              businesses={businesses} 
              onExport={handleExport} 
            />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results
                </h2>
                <span className="text-sm text-muted-foreground">
                  {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found for "{searchQuery}"
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business, index) => (
                  <BusinessCard key={index} business={business} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {isSearching && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Searching for businesses...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
