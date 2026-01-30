'use client';

import { useEffect, useRef, useState } from 'react';

// Chess piece SVG paths - each piece is designed for ~24x24 viewBox
const CHESS_PIECES = [
  {
    name: 'Pawn',
    // Simple pawn silhouette
    path: 'M12 2a3 3 0 0 0-3 3c0 1.1.6 2.1 1.5 2.6C9.6 8.2 9 9.5 9 11h6c0-1.5-.6-2.8-1.5-3.4A3 3 0 0 0 12 2zM8 12v1h8v-1H8zm-1 2v1h10v-1H7zm-1 2l1 6h10l1-6H6z',
  },
  {
    name: 'Knight',
    // Knight horse head
    path: 'M6 22v-2h1v-2l-1-1v-3l2-2V9l1-2 2-2h1V4l1-1h2l1 2-1 2h2l1 2v3l-2 2v2l1 1v2h1v2H6zm4-14l-1 1v2l2-1 1-1V8h-2zm1 4l-2 2v1h6v-1l-2-2h-2z',
  },
  {
    name: 'Bishop',
    // Bishop with mitre
    path: 'M12 2l-1 3-2 1v2l-1 1v2l-1 2v2h-1v1h12v-1h-1v-2l-1-2v-2l-1-1V6l-2-1-1-3zm0 3a1 1 0 0 1 1 1v2h-2V6a1 1 0 0 1 1-1zM7 17v1h10v-1H7zm-1 2l1 3h10l1-3H6z',
  },
  {
    name: 'Rook',
    // Rook castle tower
    path: 'M5 2h2v3h2V2h6v3h2V2h2v5h-2v8h2v2H5v-2h2V7H5V2zm4 5v8h2V7H9zm4 0v8h2V7h-2zM5 18v1h14v-1H5zm-1 2v2h16v-2H4z',
  },
  {
    name: 'Queen',
    // Queen with crown
    path: 'M12 1l-2 5-4-3 1 6H5l-1 4h16l-1-4h-2l1-6-4 3-2-5zM7 14v1h10v-1H7zm-1 2v1h12v-1H6zm-1 2l1 3h12l1-3H5z',
  },
  {
    name: 'King',
    // King with cross
    path: 'M11 1v2H9v2h2v2l-3 1-2 3v2H5v2h14v-2h-1v-2l-2-3-3-1V5h2V3h-2V1h-2zM8 12l2-2 2 1 2-1 2 2v1H8v-1zm-1 3h10v1H7v-1zm-1 2l1 3h10l1-3H6z',
  },
];

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieceIndexRef = useRef(0);
  const prevPieceIndexRef = useRef(0);
  const transitionRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = 48;
    canvas.height = 48;

    let mouseX = 0;
    let mouseY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let isHovering = false;
    let isVisible = true;
    let trailPoints: { x: number; y: number; age: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Add trail point
      trailPoints.push({ x: mouseX, y: mouseY, age: 0 });
      if (trailPoints.length > 12) trailPoints.shift();
    };

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const newIndex = Math.min(5, Math.floor(scrollPercent * 6));
      if (newIndex !== pieceIndexRef.current) {
        prevPieceIndexRef.current = pieceIndexRef.current;
        pieceIndexRef.current = newIndex;
        transitionRef.current = 1; // Start transition animation
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]')) {
        isHovering = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]')) {
        isHovering = false;
      }
    };

    const handleMouseLeave = () => { isVisible = false; };
    const handleMouseEnter = () => { isVisible = true; };

    // Draw chess piece from SVG path on canvas
    const drawPiece = (
      context: CanvasRenderingContext2D,
      pieceIdx: number,
      size: number,
      alpha: number,
      color: string
    ) => {
      const piece = CHESS_PIECES[pieceIdx];
      if (!piece) return;

      context.save();
      context.globalAlpha = alpha;
      context.translate(24, 24);
      context.scale(size / 24, size / 24);
      context.translate(-12, -12);

      const path2d = new Path2D(piece.path);

      // Shadow/glow
      context.shadowColor = color;
      context.shadowBlur = 8;
      context.fillStyle = color;
      context.fill(path2d);

      // Outline
      context.shadowBlur = 0;
      context.strokeStyle = 'rgba(255,255,255,0.8)';
      context.lineWidth = 0.5;
      context.stroke(path2d);

      context.restore();
    };

    const animate = () => {
      // Smooth follow
      canvasX += (mouseX - canvasX) * 0.15;
      canvasY += (mouseY - canvasY) * 0.15;

      if (canvas) {
        canvas.style.left = `${canvasX}px`;
        canvas.style.top = `${canvasY}px`;
        canvas.style.opacity = isVisible ? '1' : '0';
      }

      // Clear canvas
      ctx.clearRect(0, 0, 48, 48);

      if (!isVisible) {
        requestAnimationFrame(animate);
        return;
      }

      const baseSize = isHovering ? 16 : 12;
      const mainColor = isHovering ? '#FF6B35' : '#D4AF37';

      // Transition animation
      if (transitionRef.current > 0) {
        transitionRef.current -= 0.05;

        // Fade out old piece
        if (transitionRef.current > 0.5) {
          const oldAlpha = (transitionRef.current - 0.5) * 2;
          const oldScale = 1 + (transitionRef.current - 0.5) * 0.5;
          drawPiece(ctx, prevPieceIndexRef.current, baseSize * oldScale, oldAlpha, mainColor);
        }

        // Fade in new piece
        if (transitionRef.current < 0.7) {
          const newAlpha = 1 - (transitionRef.current / 0.7);
          const newScale = 0.5 + newAlpha * 0.5;
          drawPiece(ctx, pieceIndexRef.current, baseSize * newScale, newAlpha, mainColor);
        }
      } else {
        drawPiece(ctx, pieceIndexRef.current, baseSize, 1, mainColor);
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(24, 24, isHovering ? 22 : 18, 0, Math.PI * 2);
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Age trail points
      trailPoints = trailPoints.map(p => ({ ...p, age: p.age + 1 })).filter(p => p.age < 15);

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Set initial piece based on current scroll
    handleScroll();
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="chess-cursor-canvas"
        width={48}
        height={48}
      />
      {/* Piece indicator label */}
      <ChessPieceIndicator />
    </>
  );
}

function ChessPieceIndicator() {
  const [currentPiece, setCurrentPiece] = useState('Pawn');
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const idx = Math.min(5, Math.floor(scrollPercent * 6));
      const newName = CHESS_PIECES[idx]?.name || 'Pawn';

      if (newName !== currentPiece) {
        setCurrentPiece(newName);
        setShow(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShow(false), 2000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPiece]);

  return (
    <div
      className={`chess-piece-indicator ${show ? 'chess-piece-indicator-visible' : ''}`}
    >
      <span className="text-xs font-bold tracking-widest uppercase">{currentPiece}</span>
    </div>
  );
}
