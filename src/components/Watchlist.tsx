
import { Token } from '@/services/tokenData';
import TokenCard from './TokenCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface WatchlistProps {
  tokens: Token[];
  onUpdate: () => void;
}

const Watchlist = ({ tokens, onUpdate }: WatchlistProps) => {
  if (tokens.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Your watchlist is empty. Click the star icon on any token to add it to your watchlist.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} onUpdate={onUpdate} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
