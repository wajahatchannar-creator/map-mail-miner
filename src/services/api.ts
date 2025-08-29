import { Business } from '@/components/BusinessCard';

// Backend API base URL - REPLACE WITH YOUR ACTUAL BACKEND URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL);

export class ApiService {
  static async searchBusinesses(query: string): Promise<Business[]> {
    try {
      const url = `${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
      console.log('Attempting to fetch from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.businesses || [];
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search businesses. Please check your backend connection.');
    }
  }

  static async exportData(email: string, businesses: Business[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          data: businesses,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Export successful:', result);
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export data. Please try again.');
    }
  }
}