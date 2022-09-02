import styles from "./index.module.scss";
import { useState } from "react";

import classnames from "classnames/bind";

const cx = classnames.bind(styles);
export default function TextField({
  placeholder,
  className,
  disabled,
  value,
  onChange,
  type,
}) {
  const [passOpen, setPassOpen] = useState(false);
  return (
    <input
      className={cx("input", className)}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      type={type}
    />
  );
}
