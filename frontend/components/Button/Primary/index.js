import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import { useState } from 'react';
import Loader from '../Loader';

export default function PrimaryButton({
  children,
  className,
  click,
  loading,
  ...props
}) {
  return (
    <button
      onClick={click}
      className={cx('button', className)}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader /> : children}
    </button>
  );
}
