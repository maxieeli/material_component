import type { PresetColorType, SeedToken } from '..';

export const defaultPresetColors: PresetColorType = {
  blue: '#2E41B6',
  purple: '#9C27B0',
  cyan: '#00BCD4',
  green: '#4CAF50',
  pink: '#eb2f96',
  red: '#D32F2F',
  orange: '#FF9800',
  yellow: '#FFEB3B',
  geekblue: '#03A9F4',
  lime: '#CDDC39',
};

const seedToken: SeedToken = {
  // preset color palettes
  ...defaultPresetColors,

  // Color
  colorPrimary: '#2E41B6',
  colorSuccess: '#4CAF50',
  colorWarning: '#FF9800',
  colorError: '#D32F2F',
  colorInfo: '#2E41B6',
  colorTextBase: '',
  colorTextLightSolid: '#fff',

  colorBgBase: '',

  // Font
  fontFamily: `Roboto, Helvetica, Arial, sans-serif`,
  fontSizeBase: 14,

  // Grid
  gridUnit: 4,
  gridBaseStep: 2,

  // Line
  lineWidth: 1,
  lineType: 'solid',

  // Motion
  motionUnit: 0.1,
  motionBase: 0,
  motionEaseOutCirc: `cubic-bezier(0.08, 0.82, 0.17, 1)`,
  motionEaseInOutCirc: `cubic-bezier(0.78, 0.14, 0.15, 0.86)`,
  motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  motionEaseInOut: `cubic-bezier(0.645, 0.045, 0.355, 1)`,
  motionEaseOutBack: `cubic-bezier(0.12, 0.4, 0.29, 1.46)`,
  motionEaseInQuint: `cubic-bezier(0.645, 0.045, 0.355, 1)`,
  motionEaseOutQuint: `cubic-bezier(0.23, 1, 0.32, 1)`,

  // Radius
  radiusBase: 6,

  // Size
  sizeUnit: 4,
  sizeBaseStep: 4,
  sizePopupArrow: 16,

  // Control Base
  controlHeight: 32,

  // zIndex
  zIndexBase: 0,
  zIndexPopupBase: 1500,

  // Image
  opacityImage: 1,

  // Wireframe
  wireframe: false,
};
export default seedToken;
