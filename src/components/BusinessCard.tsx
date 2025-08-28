import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Globe, ExternalLink } from "lucide-react";

export interface Business {
  name: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  coordinates?: string;
  mapsLink?: string;
}

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Card className="p-6 hover:shadow-glow transition-all duration-300 border border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {business.name}
          </h3>
          
          {business.category && (
            <Badge variant="secondary" className="text-xs">
              {business.category}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {business.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{business.rating}</span>
            </div>
            {business.reviewCount && (
              <span className="text-sm text-muted-foreground">
                ({business.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Address */}
        {business.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {business.address}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {business.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`tel:${business.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {business.phone}
              </a>
            </div>
          )}
          
          {business.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a 
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Visit Website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Maps Link */}
        {business.mapsLink && (
          <div className="pt-2 border-t border-border">
            <a 
              href={business.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View on Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};