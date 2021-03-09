const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

// eslint-disable-next-line import/prefer-default-export
export const hasAuthParams = (searchParams = window.location.search): boolean =>
  CODE_RE.test(searchParams) && STATE_RE.test(searchParams);
