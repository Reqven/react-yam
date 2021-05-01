import './LoadingWidget.css';
import React from 'react';
import { Spinner } from 'react-bootstrap'


const LoadingWidget = (props) => {
  const { label, variant, size } = props;

  return (
    <div className="loading-widget">
      <small className="text-muted">{label}</small>
      <Spinner animation="border" variant={variant} size={size}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  )
}

LoadingWidget.defaultProps = {
  label: 'Loading..',
  variant: '',
  size: 'md'
};

export default LoadingWidget;
