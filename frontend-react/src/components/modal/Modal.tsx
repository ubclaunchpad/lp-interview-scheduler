import React from "react";
import ReactDOM from "react-dom";
import { ModalForm } from "./ModalForm";
import FocusTrap from "focus-trap-react";
import styles from "../styles/Modal.module.css";

export const Modal = ({
  onClickOutside,
  onKeyDown,
  modalRef,
  buttonRef,
  closeModal,
  onSubmit,
}: {
  onClickOutside: any;
  onKeyDown: any;
  modalRef: any;
  buttonRef: any;
  closeModal: any;
  onSubmit: any;
}) => {
  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        className={styles.modalCover}
        onClick={onClickOutside}
        onKeyDown={onKeyDown}
      >
        <div className={styles.modalArea} ref={modalRef}>
          <button
            ref={buttonRef}
            aria-label="Close Modal"
            aria-labelledby="close-modal"
            className={styles.modalClose}
            onClick={closeModal}
          >
            <span id="close-modal" className={styles.hideVisual}>
              Close
            </span>
            <svg className={styles.modalCloseIcon} viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className={styles.modalBody}>
            <ModalForm onSubmit={onSubmit} />
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
