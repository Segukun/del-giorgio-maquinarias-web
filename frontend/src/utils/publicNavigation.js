export const shouldScrollToTop = (previousPath, location, navigationType) =>
  navigationType !== "POP" &&
  previousPath !== location.pathname &&
  !location.hash &&
  !/^\/admin(?:\/|$)/.test(location.pathname);
