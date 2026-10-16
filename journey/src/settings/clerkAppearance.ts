// External
import type { ClerkProvider } from '@clerk/react';
import type { ComponentProps } from 'react';

export const clerkAppearance: ComponentProps<
  typeof ClerkProvider
>['appearance'] = {
  variables: {
    borderRadius: '4px',
    colorBackground: '#f5f5f5',
    colorDanger: 'orange',
    colorForeground: '#424242',
    colorPrimary: '#34495e',
    colorPrimaryForeground: 'white',
    fontFamily: 'IBM Plex Sans',
    fontFamilyMono: 'IBM Plex Mono',
  },
};
