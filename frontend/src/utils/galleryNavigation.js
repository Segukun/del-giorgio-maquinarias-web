export const nextImageIndex = (index, step, count) =>
  count > 0 ? ((index + step) % count + count) % count : 0;

export const swipeDirection = (start, end) => {
  if (!start || !end) return 0;
  const x = end.clientX - start.clientX;
  const y = end.clientY - start.clientY;
  return Math.abs(x) >= 42 && Math.abs(x) > Math.abs(y) ? (x > 0 ? -1 : 1) : 0;
};
