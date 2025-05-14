
import { Token } from '@/services/tokenData';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LeaderboardProps {
  topROI: Token[];
  topVolume: Token[];
  topCreators: {
    handle: string;
    count: number;
    tokens: Token[];
  }[];
}

const Leaderboard = ({ topROI, topVolume, topCreators }: LeaderboardProps) => {
  const [activeTab, setActiveTab] = useState("roi");
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leaderboards</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="roi" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="roi">Top ROI</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roi" className="mt-2 space-y-2">
            {topROI.map((token, index) => (
              <div key={token.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">${token.ticker}</div>
                    <div className="text-xs text-muted-foreground">@{token.creatorHandle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium">${token.currentPrice.toFixed(6)}</div>
                  <div className={`text-xs ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="volume" className="mt-2 space-y-2">
            {topVolume.map((token, index) => (
              <div key={token.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">${token.ticker}</div>
                    <div className="text-xs text-muted-foreground">@{token.creatorHandle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium">
                    ${(token.volume24h / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-muted-foreground">24h Volume</div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="creators" className="mt-2 space-y-2">
            {topCreators.map((creator, index) => (
              <div key={creator.handle} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">@{creator.handle}</div>
                    <div className="text-xs text-muted-foreground">
                      {creator.tokens.map(t => `$${t.ticker}`).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{creator.count}</div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
