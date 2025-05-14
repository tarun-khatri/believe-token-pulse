
import { cn } from '@/lib/utils';

interface HypeMeterProps {
  mentions: number;
  maxMentions?: number;
  className?: string;
}

const HypeMeter = ({ mentions, maxMentions = 100, className }: HypeMeterProps) => {
  const percentage = Math.min(100, (mentions / maxMentions) * 100);
  
  const getColor = () => {
    if (percentage < 33) return 'bg-green-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-xs mb-1">
        <span>Hype Meter</span>
        <span>{mentions} mentions</span>
      </div>
      <div className="hypemeter-bar bg-secondary">
        <div 
          className={`${getColor()} h-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HypeMeter;
