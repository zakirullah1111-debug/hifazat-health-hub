import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

const PatientFavorites = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Favorite Doctors</h1>

      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-semibold text-sm text-foreground truncate">Dr. Favorite Doctor</h3>
                <p className="text-xs text-muted-foreground">Dermatologist • Available</p>
              </div>
              <button className="shrink-0">
                <Heart className="h-5 w-5 text-emergency fill-emergency" />
              </button>
            </CardContent>
          </Card>
        ))}

        {/* Empty state */}
        <div className="text-center py-8 text-muted-foreground text-sm">
          Your favorite doctors will appear here
        </div>
      </div>
    </div>
  );
};

export default PatientFavorites;
