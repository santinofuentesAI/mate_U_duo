export const palettes = {
  violet: { label: 'Violeta', main: '#6941d9', dark: '#b6a0ff', deep: '#4f2da9', soft: '#efe9ff', night: '#34294c' },
  ocean: { label: 'Azul', main: '#215dc0', dark: '#8ebcff', deep: '#17458d', soft: '#e7efff', night: '#24364f' },
  forest: { label: 'Verde', main: '#087564', dark: '#72d6c4', deep: '#065749', soft: '#e0f4ee', night: '#203c36' },
  rose: { label: 'Rosa', main: '#ac3267', dark: '#ffa2ca', deep: '#82244d', soft: '#ffe9f2', night: '#462837' },
};
export type Palette = keyof typeof palettes;
export function validPalette(value: unknown): Palette {
  return typeof value === 'string' && Object.hasOwn(palettes, value) ? value as Palette : 'violet';
}
