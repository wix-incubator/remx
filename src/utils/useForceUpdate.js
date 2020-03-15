import React from 'react';

export default function useForceUpdate() {
  const [, updateCounter] = React.useState(0);
  return () => updateCounter((c) => ++c);
}
