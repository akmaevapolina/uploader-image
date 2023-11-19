import React, { FC, CSSProperties } from 'react';

interface CrossIconProps {
  size?: string;
  thickness?: string;
  color?: string;
}

const CrossIcon: FC<CrossIconProps> = ({ size, thickness, color }) => {
  const iconStyle: CSSProperties = {
    width: size || '24px',
    height: size || '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const lineStyle1: CSSProperties = {
    width: thickness || '2px',
    height: '100%',
    backgroundColor: color || 'black',
    position: 'absolute',
    transform: 'rotate(43deg)',
  };

  const lineStyle2: CSSProperties = {
    width: thickness || '2px',
    height: '100%',
    backgroundColor: color || 'black',
    position: 'absolute',
    transform: 'rotate(137deg)',
  };

  return (
    <div style={iconStyle}>
      <div style={{ ...lineStyle1, left: '5' }}></div>
      <div style={{ ...lineStyle2, right: '5' }}></div>
    </div>
  );
};

export default CrossIcon;
