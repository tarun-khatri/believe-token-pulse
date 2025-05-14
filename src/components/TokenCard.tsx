
import { Token, getTopWalletsForToken, toggleWatchlist } from '@/services/tokenData';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import { useState } from 'react';
import Sparkline from './Sparkline';
import HypeMeter from './HypeMeter';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

interface TokenCardProps {
  token: Token;
  onUpdate?: () => void;
}

const TokenCard = ({ token, onUpdate }: TokenCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleWatchlistToggle = () => {
    toggleWatchlist(token.id);
    if (onUpdate) onUpdate();
  };
  
  const handleTradeClick = () => {
    window.open(`https://jup.ag/swap/USDC-${token.ticker}`, '_blank');
  };
  
  const topWallets = getTopWalletsForToken(token.id);
  const launchDate = new Date(token.launchTime);
  const timeAgo = formatDistanceToNow(launchDate, { addSuffix: true });
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-200">
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">${token.ticker}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleWatchlistToggle}
                      className="focus:outline-none"
                      aria-label={token.inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      <Star 
                        className={`h-5 w-5 ${token.inWatchlist ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {token.inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm text-muted-foreground">
              @{token.creatorHandle} • {timeAgo}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold">
              ${token.currentPrice.toFixed(6)}
            </div>
            <div className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <Sparkline 
            data={token.priceHistory} 
            className="my-2 h-8" 
          />
          
          <div className="grid grid-cols-2 gap-2 my-3 text-sm">
            <div>
              <div className="text-muted-foreground">Market Cap</div>
              <div className="font-mono font-medium">{formatCurrency(token.marketCap)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Volume 24h</div>
              <div className="font-mono font-medium">{formatCurrency(token.volume24h)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Holders</div>
              <div className="font-mono font-medium">{formatNumber(token.holderCount)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Transactions 24h</div>
              <div className="font-mono font-medium">{formatNumber(token.transactions24h)}</div>
            </div>
          </div>
          
          <HypeMeter mentions={token.mentions} className="mt-2 mb-3" />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              Details
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-believe-600 hover:bg-believe-700"
              onClick={handleTradeClick}
            >
              Trade
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>${token.ticker} Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Top Holders</h4>
              <div className="space-y-2">
                {topWallets.map((wallet) => (
                  <div key={wallet.id} className="flex justify-between items-center">
                    <span>{wallet.label}</span>
                    <span className="font-mono">{wallet.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Additional Stats</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Liquidity Depth</div>
                  <div className="font-mono font-medium">{formatCurrency(token.liquidityDepth)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fees 24h</div>
                  <div className="font-mono font-medium">{formatCurrency(token.fees24h)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">30m Change</div>
                  <div className={`font-mono font-medium ${token.priceChange30m >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.priceChange30m >= 0 ? '+' : ''}{token.priceChange30m.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Launch Date</div>
                  <div className="font-medium">
                    {launchDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenCard;
