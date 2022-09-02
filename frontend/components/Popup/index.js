import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import React, { useEffect, useCallback } from 'react';
import ClientOnlyPortal from './ClientOnlyPortal';

export default function useOnClickOutside(ref, handler) {
  const escapeListener = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        handler(e);
      }
    },
    [handler]
  );
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    document.addEventListener('keyup', escapeListener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
      document.removeEventListener('keyup', escapeListener);
    };
  }, [ref, handler, escapeListener]);
}

const Popup = React.forwardRef((props, ref) => {
  const {
    children,
    heading,
    popupState,
    className,
    noPadding = false,
    center = false,
    ...others
  } = props;

  return (
    <ClientOnlyPortal selector='#popupContainer'>
      <div
        className={cx(styles['popup-overlay'], {
          [styles['popup-overlay--open']]: popupState,
        })}
      />
      <div
        className={cx(styles.popup, className, {
          [styles['popup--open']]: popupState,
          [styles['popup--no-padding']]: noPadding,
          [styles['popup--center']]: center,
        })}
        ref={ref}
        {...others}
      >
        {heading ? <h1 className={styles.popup__heading}>{heading}</h1> : null}
        {children}
      </div>
    </ClientOnlyPortal>
  );
});

export { Popup, useOnClickOutside };
