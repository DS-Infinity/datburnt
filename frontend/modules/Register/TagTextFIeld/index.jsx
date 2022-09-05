import styles from "./index.module.scss";
import { useState } from "react";

import classnames from "classnames/bind";

const cx = classnames.bind(styles);
export default function TagTextField({
  placeholder,
  className,
  disabled,
  value,
  onChange,
  type,
  num,
}) {
  // // (className)

  const [passOpen, setPassOpen] = useState(false);
  return (
    <div className={styles.harrystyles}>
      <input
        className={cx("input", className)}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        type={type}
      />
      <div className={styles.harrystyles__div}>
        <h2 className={styles.harrystyles__div__h2}>#{num}</h2>
      </div>
    </div>
  );
}
