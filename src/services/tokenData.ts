
export interface Token {
  id: string;
  ticker: string;
  name: string;
  creatorHandle: string;
  launchTime: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  transactions24h: number;
  fees24h: number;
  holderCount: number;
  liquidityDepth: number;
  priceChange30m: number;
  priceChange24h: number;
  priceHistory: number[];
  mentions: number;
  inWatchlist: boolean;
}

export interface TopWallet {
  id: string;
  tokenId: string;
  label: string;
  percentage: number;
}

// Generate mock price history data
const generatePriceHistory = (length: number, volatility: number, trend: number): number[] => {
  const history: number[] = [];
  let price = Math.random() * 0.1; // Start at a small random value
  
  for (let i = 0; i < length; i++) {
    price = Math.max(0.000001, price * (1 + (Math.random() - 0.5) * volatility + trend));
    history.push(price);
  }
  
  return history;
};

// Generate random wallets for a token
const generateTopWallets = (tokenId: string): TopWallet[] => {
  const wallets: TopWallet[] = [];
  let remainingPercentage = 100;
  
  for (let i = 0; i < 5; i++) {
    const label = `Wallet ${String.fromCharCode(65 + i)}`;
    let percentage = i === 4 
      ? remainingPercentage 
      : Math.min(remainingPercentage - 1, Math.floor(Math.random() * remainingPercentage * 0.6));
    
    remainingPercentage -= percentage;
    
    wallets.push({
      id: `wallet-${tokenId}-${i}`,
      tokenId,
      label,
      percentage
    });
  }
  
  return wallets;
};

// Generate mock tokens
export const generateMockTokens = (count: number): Token[] => {
  const tokens: Token[] = [];
  const now = new Date();
  
  const tickers = [
    "BLVE", "SLNA", "PNDA", "MOON", "STAR", "GMBL", "SHDW", "DGOD", "MYTH", 
    "GAME", "META", "UNVS", "HERO", "PXLS", "ATOM", "NEON", "TRBN", "SOLO", 
    "PRME", "DRGN", "PNIX", "RBTS", "ECHO", "AQUA", "VRTX", "FLSH", "GLOW"
  ];
  
  const names = [
    "Believe", "Solana Prime", "Crypto Panda", "Moon Shot", "Star Dust", "Gamble King", 
    "Shadow Protocol", "Degen Gods", "Mythic Network", "Game Verse", "Metaverse Token", 
    "Universe", "Hero Quest", "Pixels", "Atomic", "Neon District", "Turbine", "Solo Finance", 
    "Prime Collective", "Dragon Chain", "Phoenix", "Robotic Systems", "Echo Network", 
    "Aqua Finance", "Vertex AI", "Flash Protocol", "Glow Finance"
  ];
  
  const creatorHandles = [
    "solana_labs", "raj_gokal", "aeyakovenko", "superteamDAO", "solana_devs", 
    "helium", "phantom", "solanafndn", "solana_spaces", "StepFinance", "orca_so", 
    "drift_trade", "mango_markets", "solend_solana", "jupiter_ex", "metaplex", 
    "solflare_wallet", "heliuslabs", "magiceden", "tensor_hq", "zeta_markets", 
    "solblaze", "jito_sol", "marinade_finance", "saber_hq", "jup_ag", "solana_monkey"
  ];
  
  for (let i = 0; i < count; i++) {
    const tickerIndex = Math.floor(Math.random() * tickers.length);
    const nameIndex = Math.floor(Math.random() * names.length);
    const creatorIndex = Math.floor(Math.random() * creatorHandles.length);
    
    // Generate a random launch time between now and 30 days ago
    const launchTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    // Generate price history with a slight upward trend for newer tokens
    const daysSinceLaunch = (now.getTime() - launchTime.getTime()) / (24 * 60 * 60 * 1000);
    const trend = Math.max(0, 0.05 - (daysSinceLaunch * 0.001));
    const priceHistory = generatePriceHistory(100, 0.1, trend);
    
    const currentPrice = priceHistory[priceHistory.length - 1];
    const supply = Math.floor(Math.random() * 1000000000) + 10000000;
    const marketCap = currentPrice * supply;
    
    // Calculate price changes
    const price30mAgo = priceHistory[priceHistory.length - 6] || priceHistory[0];
    const price24hAgo = priceHistory[0];
    const priceChange30m = ((currentPrice - price30mAgo) / price30mAgo) * 100;
    const priceChange24h = ((currentPrice - price24hAgo) / price24hAgo) * 100;
    
    tokens.push({
      id: `token-${i}`,
      ticker: tickers[tickerIndex],
      name: names[nameIndex],
      creatorHandle: creatorHandles[creatorIndex],
      launchTime: launchTime.toISOString(),
      currentPrice,
      marketCap,
      volume24h: Math.random() * marketCap * 0.3,
      transactions24h: Math.floor(Math.random() * 10000) + 100,
      fees24h: Math.random() * 10 + 0.1,
      holderCount: Math.floor(Math.random() * 5000) + 50,
      liquidityDepth: marketCap * (Math.random() * 0.3 + 0.05),
      priceChange30m,
      priceChange24h,
      priceHistory,
      mentions: Math.floor(Math.random() * 100) + 1,
      inWatchlist: Math.random() > 0.8
    });
  }
  
  return tokens;
};

// Get top wallets for a token
export const getTopWalletsForToken = (tokenId: string): TopWallet[] => {
  return generateTopWallets(tokenId);
};

// Mock tokens for initial data
const mockTokens = generateMockTokens(20);

// Mock leaderboard data
export const getTopROI = () => {
  return [...mockTokens].sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, 5);
};

export const getTopVolumeMovers = () => {
  return [...mockTokens].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);
};

export const getTopFollowedCreators = () => {
  const creatorCounts: Record<string, number> = {};
  
  mockTokens.forEach(token => {
    creatorCounts[token.creatorHandle] = (creatorCounts[token.creatorHandle] || 0) + 1;
  });
  
  const creators = Object.keys(creatorCounts).map(handle => ({
    handle,
    count: creatorCounts[handle],
    tokens: mockTokens.filter(t => t.creatorHandle === handle)
  }));
  
  return creators.sort((a, b) => b.count - a.count).slice(0, 5);
};

// Mock real-time data update
export const getTokens = (): Token[] => {
  return mockTokens;
};

export const getWatchlistTokens = (): Token[] => {
  return mockTokens.filter(token => token.inWatchlist);
};

export const toggleWatchlist = (tokenId: string): void => {
  const token = mockTokens.find(t => t.id === tokenId);
  if (token) {
    token.inWatchlist = !token.inWatchlist;
  }
};

// Simulate real-time updates
export const simulateDataUpdate = () => {
  mockTokens.forEach(token => {
    // Update price with slight random change
    const priceChange = token.currentPrice * (Math.random() * 0.04 - 0.02);
    token.currentPrice += priceChange;
    token.currentPrice = Math.max(0.000001, token.currentPrice);
    
    // Update market cap based on new price
    const supplyEstimate = token.marketCap / (token.currentPrice - priceChange);
    token.marketCap = token.currentPrice * supplyEstimate;
    
    // Update mentions with small random changes
    token.mentions += Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
    
    // Update price history
    token.priceHistory.push(token.currentPrice);
    token.priceHistory.shift();
    
    // Recalculate price changes
    const price30mAgo = token.priceHistory[token.priceHistory.length - 6] || token.priceHistory[0];
    const price24hAgo = token.priceHistory[0];
    token.priceChange30m = ((token.currentPrice - price30mAgo) / price30mAgo) * 100;
    token.priceChange24h = ((token.currentPrice - price24hAgo) / price24hAgo) * 100;
    
    // Update other metrics with slight changes
    token.volume24h += token.volume24h * (Math.random() * 0.06 - 0.03);
    token.transactions24h += Math.floor(Math.random() * 10) - 5;
    token.fees24h += token.fees24h * (Math.random() * 0.04 - 0.02);
    token.holderCount += Math.random() > 0.8 ? 1 : 0;
    token.liquidityDepth += token.liquidityDepth * (Math.random() * 0.02 - 0.01);
  });
  
  // Add a new token occasionally
  if (Math.random() > 0.9) {
    const newTokens = generateMockTokens(1);
    mockTokens.unshift(newTokens[0]);
  }
  
  return mockTokens;
};
