import React from 'react';

const Flex = ({
  children,
  flexDirection = 'row',
  alignItems = 'center',
  justifyContent = 'center',
  overrideStyle = {},
}) => {
  const styles = {
    display: 'flex',
    flexDirection,
    alignItems,
    justifyContent,
    ...overrideStyle,
  };
  return (
    <div style={styles}>
      {children}
    </div>
  );
};

export default Flex;
