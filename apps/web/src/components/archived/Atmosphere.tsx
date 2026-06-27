import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    AigencyAtmosphere?: {
      mount: (opts?: { target?: HTMLElement; fixed?: boolean; density?: number; parallax?: boolean }) => {
        destroy: () => void;
        rebuild: () => void;
      };
    };
  }
}

export function Atmosphere() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let cleanup: (() => void) | undefined;

    const load = () => {
      if (window.AigencyAtmosphere) {
        const instance = window.AigencyAtmosphere.mount({ fixed: true, density: 0.7, parallax: true });
        cleanup = instance.destroy;
        return;
      }
      const script = document.createElement('script');
      script.src = '/atmosphere.js';
      script.async = true;
      script.onload = () => {
        if (window.AigencyAtmosphere) {
          const instance = window.AigencyAtmosphere.mount({ fixed: true, density: 0.7, parallax: true });
          cleanup = instance.destroy;
        }
      };
      document.body.appendChild(script);
    };

    load();

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}
