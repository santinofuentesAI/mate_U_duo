export const palettes = {
  violet: { label: 'Violeta', main: '#6941d9', dark: '#b6a0ff', deep: '#4f2da9', soft: '#efe9ff', night: '#34294c' },
  ocean: { label: 'Azul', main: '#215dc0', dark: '#8ebcff', deep: '#17458d', soft: '#e7efff', night: '#24364f' },
  forest: { label: 'Verde', main: '#087564', dark: '#72d6c4', deep: '#065749', soft: '#e0f4ee', night: '#203c36' },
  rose: { label: 'Rosa', main: '#ac3267', dark: '#ffa2ca', deep: '#82244d', soft: '#ffe9f2', night: '#462837' },
  coral: { label: 'Coral', main: '#b84b31', dark: '#ffac97', deep: '#8c351f', soft: '#fff0e9', night: '#452a26' },
  amber: { label: 'Dorado', main: '#966114', dark: '#ffd382', deep: '#70460b', soft: '#fff4db', night: '#443722' },
  indigo: { label: 'Índigo', main: '#3d49ad', dark: '#a7b4ff', deep: '#2c3585', soft: '#e9edff', night: '#272b48' },
  turquoise: { label: 'Turquesa', main: '#087684', dark: '#83dce7', deep: '#075763', soft: '#e2f6f7', night: '#213d43' },
  plum: { label: 'Ciruela', main: '#843b97', dark: '#dfa7e9', deep: '#632774', soft: '#f7eafb', night: '#3e2a45' },
};
export type Palette = keyof typeof palettes;
export function validPalette(value: unknown): Palette {
  return typeof value === 'string' && Object.hasOwn(palettes, value) ? value as Palette : 'violet';
}
