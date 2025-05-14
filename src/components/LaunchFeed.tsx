
import { Token } from '@/services/tokenData';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LaunchFeedProps {
  tokens: Token[];
}

const LaunchFeed = ({ tokens }: LaunchFeedProps) => {
  // Sort tokens by launch time (newest first)
  const sortedTokens = [...tokens].sort((a, b) => 
    new Date(b.launchTime).getTime() - new Date(a.launchTime).getTime()
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Launches</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="space-y-3">
          {sortedTokens.map((token) => {
            const launchDate = new Date(token.launchTime);
            const timeAgo = formatDistanceToNow(launchDate, { addSuffix: true });
            
            return (
              <div key={token.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div>
                  <div className="font-medium">${token.ticker}</div>
                  <div className="text-sm text-muted-foreground">
                    <a 
                      href={`https://twitter.com/${token.creatorHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-believe-500 hover:underline"
                    >
                      @{token.creatorHandle}
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{timeAgo}</div>
                  <div className="text-xs">
                    {launchDate.toLocaleTimeString()} UTC
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchFeed;
