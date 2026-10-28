import { useState } from 'react';

const getCurrentTime = (): number => Date.now();

export const useMountedNow = (): number => {
  const [mountedAt] = useState(getCurrentTime);

  return mountedAt;
};
