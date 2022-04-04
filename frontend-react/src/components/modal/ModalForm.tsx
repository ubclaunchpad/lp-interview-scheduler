import React from "react";
import styles from "../styles/Modal.module.css";

export const ModalForm = ({ onSubmit }: { onSubmit: any }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.modalForm}>
        <label htmlFor="email">Email Message</label>
        <textarea
          className={styles.modalMessageInput}
          id="email"
          placeholder="Write your email message template here"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
export default ModalForm;
