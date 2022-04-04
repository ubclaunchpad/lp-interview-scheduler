import React from "react";
import styles from "../styles/CreateLinkPage.module.css";

const Trigger = ({
  triggerText,
  buttonRef,
  showModal,
}: {
  triggerText: string;
  buttonRef: any;
  showModal: any;
}) => {
  return (
    <button className={styles.button} ref={buttonRef} onClick={showModal}>
      {triggerText}
    </button>
  );
};
export default Trigger;
