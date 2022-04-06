import React from "react";
import styles from "../styles/Modal.module.css";

export const ModalForm = ({ onSubmit }: { onSubmit: any }) => {
  const [modalData, setModalData] = React.useState({
    subject: "" as string,
    message: "" as string,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let newModalData = {
      ...modalData,
      [event.target.name]: event.target.value,
    };
    setModalData(newModalData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(modalData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.modalForm}>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className={styles.modalSubjectInput}
          value={modalData.subject}
          onChange={handleChange}
        />
        <label htmlFor="emailMessage">Email Message</label>
        <textarea
          className={styles.modalMessageInput}
          id="emailMessage"
          name="message"
          placeholder="Write your email message template here"
          value={modalData.message}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
export default ModalForm;
