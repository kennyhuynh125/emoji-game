import React from 'react';

const Container = ({
  children,
  width = '100%',
  height = '100%',
  overrideStyle = {},
}) => {
  const styles = {
    display: 'flex',
    flexDirecton: 'column',
    width,
    height,
    ...overrideStyle,
  };
  return (
    <div style={styles}>
      {children}
    </div>
  );
};

export default Container;
