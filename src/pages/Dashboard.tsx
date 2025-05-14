
import { useEffect, useState } from 'react';
import { 
  getTokens, 
  getWatchlistTokens, 
  getTopROI, 
  getTopVolumeMovers, 
  getTopFollowedCreators,
  simulateDataUpdate,
  Token
} from '@/services/tokenData';
import TokenCard from '@/components/TokenCard';
import LaunchFeed from '@/components/LaunchFeed';
import Leaderboard from '@/components/Leaderboard';
import Watchlist from '@/components/Watchlist';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UPDATE_INTERVAL = 10000; // 10 seconds

const Dashboard = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [watchlistTokens, setWatchlistTokens] = useState<Token[]>([]);
  const [topROI, setTopROI] = useState<Token[]>([]);
  const [topVolume, setTopVolume] = useState<Token[]>([]);
  const [topCreators, setTopCreators] = useState<{handle: string; count: number; tokens: Token[]}[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const fetchData = () => {
    const allTokens = getTokens();
    setTokens(allTokens);
    setWatchlistTokens(getWatchlistTokens());
    setTopROI(getTopROI());
    setTopVolume(getTopVolumeMovers());
    setTopCreators(getTopFollowedCreators());
    setLastUpdated(new Date());
  };
  
  useEffect(() => {
    // Initial data fetch
    fetchData();
    
    // Set up interval for data updates
    const intervalId = setInterval(() => {
      simulateDataUpdate();
      fetchData();
    }, UPDATE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleWatchlistUpdate = () => {
    setWatchlistTokens(getWatchlistTokens());
  };
  
  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border">
        <div className="container flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-believe-600 rounded-md"></div>
            <h1 className="text-xl font-bold">Believe Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <LaunchFeed tokens={tokens} />
            <Leaderboard 
              topROI={topROI} 
              topVolume={topVolume} 
              topCreators={topCreators} 
            />
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Tokens</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokens.map((token) => (
                    <TokenCard key={token.id} token={token} onUpdate={handleWatchlistUpdate} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="watchlist" className="pt-4">
                <Watchlist tokens={watchlistTokens} onUpdate={handleWatchlistUpdate} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
