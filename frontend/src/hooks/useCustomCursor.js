import { useState, useEffect, useRef } from 'react';

export function useCustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorRingPos, setCursorRingPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = { x: e.clientX, y: e.clientY };
      const lerp = (a, b, t) => a + (b - a) * t;
      const animate = () => {
        ringRef.current.x = lerp(ringRef.current.x, target.x, 0.14);
        ringRef.current.y = lerp(ringRef.current.y, target.y, 0.14);
        setCursorRingPos({ ...ringRef.current });
        rafRef.current = requestAnimationFrame(animate);
      };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleHoverIn = () => setHovered(true);
  const handleHoverOut = () => setHovered(false);

  return { cursorPos, cursorRingPos, hovered, handleHoverIn, handleHoverOut };
}