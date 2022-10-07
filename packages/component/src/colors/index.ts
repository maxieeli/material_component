import generate from './generateColor';

export interface PalettesProps {
  [key: string]: string[] & { primary?: string };
}

const presetPrimaryColors: {
  [key: string]: string;
} = {
  red: '#F5222D',
  orange: '#FA8C16',
  yellow: '#FADB14',
  lime: '#A0D911',
  green: '#52C41A',
  cyan: '#13C2C2',
  blue: '#2E41B6',
  geekblue: '#2F54EB',
  purple: '#722ED1',
  grey: '#666666',
};

const presetPalettes: PalettesProps = {};
const presetDarkPalettes: PalettesProps = {};

Object.keys(presetPrimaryColors).forEach((key): void => {
  presetPalettes[key] = generate(presetPrimaryColors[key]);
  presetPalettes[key].primary = presetPalettes[key][5];

  // dark presetPalettes
  presetDarkPalettes[key] = generate(presetPrimaryColors[key], {
    theme: 'dark',
    backgroundColor: '#141414',
  });
  presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
});

const red = presetPalettes.red;
const orange = presetPalettes.orange;
const yellow = presetPalettes.yellow;
const lime = presetPalettes.lime;
const green = presetPalettes.green;
const cyan = presetPalettes.cyan;
const blue = presetPalettes.blue;
const geekblue = presetPalettes.geekblue;
const purple = presetPalettes.purple;
const grey = presetPalettes.grey;

export {
  generate,
  presetPalettes,
  presetDarkPalettes,
  presetPrimaryColors,
  red,
  orange,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  grey,
};

export const gray = grey;