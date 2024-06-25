import localFont from 'next/font/local';

export const bebasFont = localFont({
  src: [{ path: './bebas/BebasNeue-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--font-bebas',
});

export const electroliceFont = localFont({
  src: [{ path: './electrolize/Electrolize-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--font-electrolize',
});
