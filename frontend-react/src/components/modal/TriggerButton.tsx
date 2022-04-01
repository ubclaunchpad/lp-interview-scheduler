import React from "react";
const Trigger = ({
  triggerText,
  buttonRef,
  showModal,
}: {
  triggerText: any;
  buttonRef: any;
  showModal: any;
}) => {
  return (
    <button
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showModal}
    >
      {triggerText}
    </button>
  );
};
export default Trigger;
