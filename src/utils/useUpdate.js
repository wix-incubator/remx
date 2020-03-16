import React from 'react';

export default function useUpdate() {
  const [, updateCounter] = React.useState(0);
  return () => updateCounter((c) => ++c);
}
