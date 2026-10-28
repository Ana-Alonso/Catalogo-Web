export const getDaysUntilRegistrationDeadline = (
  deadline: string | null | undefined,
  nowMs: number
): number | null => {
  if (!deadline) {
    return null;
  }
  const deadlineMs = new Date(deadline).getTime();
  if (Number.isNaN(deadlineMs)) {
    return null;
  }
  if (deadlineMs <= nowMs) {
    return 0;
  }
  const diffMs = deadlineMs - nowMs;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};
