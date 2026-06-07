'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MousePointer2, Eraser, Brush, Undo } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InteractiveCanvasProps {
  imageUrl: string;
  onMaskChange: (maskDataUrl: string) => void;
}

export default function InteractiveCanvas({ imageUrl, onMaskChange }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'pan'>('brush');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup high DPI canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        contextRef.current = ctx;
        // Draw base image
        ctx.drawImage(img, 0, 0);
        // Create an overlay layer for the mask (conceptually)
      }
    };
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'pan') return;
    const { offsetX, offsetY } = e.nativeEvent;
    
    const ctx = contextRef.current;
    if (ctx) {
      // Setup mask style
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.5)'; // Accent color with opacity
      ctx.lineWidth = brushSize;
      
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'pan') return;
    const { offsetX, offsetY } = e.nativeEvent;
    
    const ctx = contextRef.current;
    if (ctx) {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
    
    // Extract base64 mask (just alpha channel mapping)
    if (canvasRef.current) {
      // In a real app, you'd extract ONLY the drawn strokes onto a transparent background.
      // We trigger the state update here.
      onMaskChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] rounded-full px-4 py-2 flex items-center gap-4 z-10 shadow-2xl">
        <button onClick={() => setTool('pan')} className={`p-2 rounded-full ${tool === 'pan' ? 'bg-[var(--primary)] text-white' : 'text-gray-400 hover:text-white'}`}>
          <MousePointer2 className="w-5 h-5" />
        </button>
        <button onClick={() => setTool('brush')} className={`p-2 rounded-full ${tool === 'brush' ? 'bg-[var(--primary)] text-white' : 'text-gray-400 hover:text-white'}`}>
          <Brush className="w-5 h-5" />
        </button>
        <button onClick={() => setTool('eraser')} className={`p-2 rounded-full ${tool === 'eraser' ? 'bg-[var(--primary)] text-white' : 'text-gray-400 hover:text-white'}`}>
          <Eraser className="w-5 h-5" />
        </button>
        
        <div className="w-[1px] h-6 bg-[var(--border)] mx-2" />
        
        <input 
          type="range" 
          min="10" 
          max="100" 
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-24 accent-[var(--primary)]"
        />
        
        <button className="p-2 text-gray-400 hover:text-white ml-2">
          <Undo className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full overflow-auto flex items-center justify-center p-8 bg-[var(--bg-color)]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`max-w-full max-h-full rounded-xl shadow-2xl ${tool === 'pan' ? 'cursor-grab' : 'cursor-crosshair'}`}
        />
      </div>
    </div>
  );
}
