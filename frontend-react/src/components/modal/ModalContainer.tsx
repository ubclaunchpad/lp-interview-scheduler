import React, { Component } from "react";
import { Modal } from "./Modal";
import TriggerButton from "./TriggerButton";

interface ModalContainerProps {
  triggerText: any;
  onSubmit: any;
}

interface ModalContainerState {}

export class ModalContainer extends Component<
  ModalContainerProps,
  ModalContainerState
> {
  state = { isShown: false };

  triggerButton: any;
  modal: any;
  closeButton: any;

  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
      this.toggleScrollLock();
    });
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.triggerButton.focus();
    this.toggleScrollLock();
  };
  onKeyDown = (event: any) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event: any) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };
  toggleScrollLock = () => {
    const query = document.querySelector("html");
    if (query != null) {
      query.classList.toggle("scroll-lock");
    }
  };

  render() {
    return (
      <React.Fragment>
        <TriggerButton
          showModal={this.showModal}
          buttonRef={(n: any) => (this.triggerButton = n)}
          triggerText={this.props.triggerText}
        />
        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n: any) => (this.modal = n)}
            buttonRef={(n: any) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ModalContainer;
