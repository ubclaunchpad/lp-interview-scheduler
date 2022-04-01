import React from "react";

export const ModalForm = ({ onSubmit }: { onSubmit: any }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email Template</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="PLACEHOLDER_TEXT"
        />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default ModalForm;
