import React from "react";
import styles from "./styles/ConfirmationMessage.module.css";

interface ConfirmProps {
  children: React.ReactElement<HTMLParagraphElement>;
  type: string;
}

export default function ConfirmationMessage({ children, type }: ConfirmProps) {
  const renderElAlert = function () {
    return React.cloneElement(children);
  };

  return (
    <div className={styles.alert}>
      {type === "success" ? (
        <div className={styles.success}>{children && renderElAlert()}</div>
      ) : (
        <div className={styles.error}>{children && renderElAlert()}</div>
      )}
    </div>
  );
}
