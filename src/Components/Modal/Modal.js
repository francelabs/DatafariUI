import React, { Fragment } from 'react';

import './Modal.css';
import close from '../../Icons/close-24px.svg';

const Modal = (props) => {
  return (
    <Fragment>
      <div className="backdrop" />
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">{props.title}</span>
          <img
            src={close}
            className="modal__close-button"
            alt="close"
            onClick={props.onClose}
          />
        </div>
        <div>{props.children}</div>
      </div>
    </Fragment>
  );
};

export default Modal;
