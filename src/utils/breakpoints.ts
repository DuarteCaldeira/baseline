/** Keep in sync with `$breakpoint-sm` in src/styles/tokens/breakpoints.scss */
export const BREAKPOINT_SM = '40rem';

export const mediaMaxWidth = (width: string): string => `(max-width: ${width})`;

export const TABLE_MOBILE_MEDIA_QUERY = mediaMaxWidth(BREAKPOINT_SM);
