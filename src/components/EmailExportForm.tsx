import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { Business } from './BusinessCard';

interface EmailExportFormProps {
  businesses: Business[];
  onExport: (email: string, data: Business[]) => Promise<void>;
}

export const EmailExportForm = ({ businesses, onExport }: EmailExportFormProps) => {
  const [email, setEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      await onExport(email.trim(), businesses);
      setExportSuccess(true);
      toast({
        title: "Export Successful!",
        description: `Data has been sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error sending your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (businesses.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-card to-secondary/30 border border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Export Your Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Get {businesses.length} business{businesses.length !== 1 ? 'es' : ''} sent to your email as a CSV file
            </p>
          </div>
        </div>

        {exportSuccess ? (
          <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-success font-medium">
              Data exported successfully!
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                disabled={isExporting}
                className="h-10"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isExporting || !email.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Email Me This Data
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};