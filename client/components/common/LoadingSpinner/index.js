import React from 'react';
import styles from './styles.module.scss';

const LoadingSpinner = ({ color }) => {
  const spinnerStyle = {
    borderLeftColor: color,
    '--spinner-color': color,
  };

  return <div className={styles.spinner} style={spinnerStyle}></div>;
};

export default LoadingSpinner;
