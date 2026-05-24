import { useState, useEffect, useRef } from 'react';

export default function PageTransition({ children, pageKey }) {
  const [visible, setVisible] = useState(false);
  const [prevKey, setPrevKey] = useState(pageKey);

  useEffect(() => {
    if (pageKey !== prevKey) {
      setVisible(false);
      const t = setTimeout(() => {
        setPrevKey(pageKey);
        setVisible(true);
      }, 150);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [pageKey]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      height: '100%',
    }}>
      {children}
    </div>
  );
}
