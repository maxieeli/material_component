import type { PresetColorType, SeedToken } from '..'

export const defaultPresetColors: PresetColorType = {
  blue: '#2E41B6',
  purple: '#9c27b0',
  cyan: '#00bcd4',
  green: '#4caf50',
  pink: '#eb2f96',
  red: '#d32f2f',
  orange: '#ff9800',
  yellow: '#ffeb3b',
  geekblue: '#03a9f4',
  lime: '#cddc39',
}

const seedToken: SeedToken = {
  ...defaultPresetColors,

  // Color
  colorPrimary: '#2E41B6',
  colorSuccess: '#4caf50',
  colorWarning: '#ff9800',
  colorError: '#d32f2f',
  colorInfo: '#2E41B6',
  colorTextBase: '',

  colorBgBase: '',

  // Font
  fontFamily: `Roboto, Helvertica, Arial, sans-serif`,
  fontSize: 14,

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
  motionEaseInBack: `cubic-bezier(0.71, -0.46, 0.88, 0.6)`,
  motionEaseInQuint: `cubic-bezier(0.645, 0.045, 0.355, 1)`,
  motionEaseOutQuint: `cubic-bezier(0.23, 1, 0.32, 1)`,
  // Radius
  borderRadius: 6,
  // Size
  sizeUnit: 4,
  sizeStep: 4,
  sizePopupArrow: 16,
  // Control Base
  controlHeight: 32,
  // zIndex
  zIndexBase: 0,
  zIndexPopupBase: 1000,
  // Image
  opacityImage: 1,
  // Wireframe
  wireframe: false,
}
export default seedToken
