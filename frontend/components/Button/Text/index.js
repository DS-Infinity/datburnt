import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function TextButton({
  children,
  className,
  click,
  loading,
  ...props
}) {
  return (
    <button
      className={cx('button', className)}
      disabled={loading}
      onClick={click}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
