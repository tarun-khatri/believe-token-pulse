
import { useRef, useEffect, useState } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  className?: string;
}

const Sparkline = ({
  data,
  width = 100,
  height = 30,
  lineColor = "stroke-believe-500",
  fillColor = "fill-believe-500/20",
  className = "",
}: SparklineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Scale points to fit canvas
    const points = data.map((value, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((value - min) / range) * height * 0.9
    }));
    
    // Draw fill
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = 'rgb(139, 92, 246)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }, [data, width, height]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.min(data.length - 1, Math.floor((x / width) * data.length));
    
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index);
      setHoveredValue(`$${data[index].toFixed(6)}`);
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredIndex(null);
  };
  
  return (
    <div className={`sparkline-container relative ${className}`}>
      {hoveredValue && (
        <div className="sparkline-tooltip">
          {hoveredValue}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full"
      />
    </div>
  );
};

export default Sparkline;
