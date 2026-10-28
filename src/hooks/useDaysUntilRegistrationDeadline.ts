import { useState } from 'react';
import { getDaysUntilRegistrationDeadline } from '../utils/registrationDeadline';

const getCurrentTime = (): number => Date.now();

export const useDaysUntilRegistrationDeadline = (
  deadline: string | null | undefined
): number | null => {
  const [mountedAt] = useState(getCurrentTime);

  return getDaysUntilRegistrationDeadline(deadline, mountedAt);
};
