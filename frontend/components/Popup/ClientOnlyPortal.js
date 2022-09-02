import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ClientOnlyPortal({ children, selector }) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
  // return mounted ? children : null;
  // return(<>popup</>)
}
