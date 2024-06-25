import React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';

const Modal = ({ children, background, isOpen, closeModal, modalClasses, containerClass }) => {
  const modalStyle = background
    ? {
        backgroundImage: `url(${background})`,
      }
    : {};

  if (!isOpen) return null;

  const contClasses = classNames('relative bg-center bg-no-repeat object-contain', {
    [containerClass]: containerClass,
  });

  return createPortal(
    <div className={`${styles.modalOverlay} ${modalClasses ? modalClasses : ''}`} onClick={closeModal}>
      <div style={modalStyle} onClick={e => e.stopPropagation()} className={contClasses}>
        {children}
        <button aria-label="close modal button" className={styles.closebutton} onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.75 5.25l-13.5 13.5M18.75 18.75L5.25 5.25"
            ></path>
          </svg>
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
