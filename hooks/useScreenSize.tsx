import { useState, useEffect } from 'react';

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    breakpoint: getBreakpoint(
      typeof window !== 'undefined' ? window.innerWidth : 0
    ),
  });

  function getBreakpoint(width: number) {
    if (width < 640) return 'sm'; // mobile
    if (width < 1024) return 'md'; // tablet
    if (width < 1440) return 'lg'; // laptop
    return 'xl'; // desktop large
  }

  useEffect(() => {
    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getBreakpoint(window.innerWidth),
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
