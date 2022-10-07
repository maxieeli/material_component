import type * as React from 'react';
import type { ComponentToken as ButtonComponentToken } from '../Button/styled';
import type { ComponentToken as CascaderComponentToken } from '../Cascader/styled';
import type { ComponentToken as CheckboxComponentToken } from '../Checkbox/styled';
import type { ComponentToken as DatePickerComponentToken } from '../DatePicker/styled';
import type { ComponentToken as DropdownComponentToken } from '../Dropdown/styled';
import type { ComponentToken as LayoutComponentToken } from '../layout/styled';
import type { ComponentToken as MenuComponentToken } from '../Menu/styled';
import type { ComponentToken as PopconfirmComponentToken } from '../PopConfirm/styled';
import type { ComponentToken as PopoverComponentToken } from '../Popover/styled';
import type { ComponentToken as SelectComponentToken } from '../Select/styled';
import type { ComponentToken as SpaceComponentToken } from '../Gap/styled';
import type { ComponentToken as LoadComponentToken } from '../Loading/styled';
import type { ComponentToken as TableComponentToken } from '../Table/styled';
import type { ComponentToken as TooltipComponentToken } from '../Tooltip/styled';
import type { ComponentToken as UploadComponentToken } from '../Upload/styled';

export const PresetColors = [
  'blue',
  'purple',
  'cyan',
  'green',
  'pink',
  'red',
  'orange',
  'yellow',
  'geekblue',
  'lime',
] as const;

type PresetColorKey = typeof PresetColors[number];

export type PresetColorType = Record<PresetColorKey, string>;

type ColorPaletteKeyIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ColorPalettes = {
  [key in `${keyof PresetColorType}-${ColorPaletteKeyIndex}`]: string;
};

export interface ComponentTokenMap {
  Button?: ButtonComponentToken;
  Cascader?: CascaderComponentToken;
  Checkbox?: CheckboxComponentToken;
  DatePicker?: DatePickerComponentToken;
  Dropdown?: DropdownComponentToken;
  Form?: {};
  Input?: {};
  Layout?: LayoutComponentToken;
  Pagination?: {};
  Popover?: PopoverComponentToken;
  PopConfirm?: PopconfirmComponentToken;
  Select?: SelectComponentToken;
  Loading?: LoadComponentToken;
  Tree?: {};
  Menu?: MenuComponentToken;
  Upload?: UploadComponentToken;
  Tooltip?: TooltipComponentToken;
  Table?: TableComponentToken;
  Space?: SpaceComponentToken;
}

export type OverrideToken = {
  [key in keyof ComponentTokenMap]: Partial<ComponentTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken = AliasToken & ComponentTokenMap;

/** Seed Token */
export interface SeedToken extends PresetColorType {
  // Color
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorTextBase: string;
  colorTextLightSolid: string;
  /** Base component background color. Will derivative container background color with this */
  colorBgBase: string;

  // Font
  fontFamily: string;
  fontSizeBase: number;

  // Grid
  gridUnit: number;
  gridBaseStep: number;

  // Line
  /** Border width of base components */
  lineWidth: number;
  lineType: string;

  // Motion
  motionUnit: number;
  motionBase: number;
  motionEaseOutCirc: string;
  motionEaseInOutCirc: string;
  motionEaseInOut: string;
  motionEaseOutBack: string;
  motionEaseInQuint: string;
  motionEaseOutQuint: string;
  motionEaseOut: string;

  // Radius
  radiusBase: number;

  // Size
  sizeUnit: number;
  sizeBaseStep: number;
  sizePopupArrow: number;

  // Control Base
  controlHeight: number;

  // zIndex
  /** Base zIndex of component like BackTop, Affix which can be cover by large popup */
  zIndexBase: number;
  /** Base popup component zIndex */
  zIndexPopupBase: number;

  // Image
  /** Define default Image opacity. Useful when in dark-like theme */
  opacityImage: number;

  // Wireframe
  wireframe: boolean;
}

export interface NeutralColorMapToken {
  // Base
  colorTextBase: string;
  colorBgBase: string;

  // Text
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorTextQuaternary: string;

  // Fill
  colorFill: string;
  colorFillSecondary: string;
  colorFillTertiary: string;
  colorFillQuaternary: string;

  // Background
  colorBgContainer: string;
  colorBgElevated: string;
  colorBgLayout: string;
  colorBgSpotlight: string;

  // Border
  colorBorder: string;
  colorBorderSecondary: string;
}

export interface ColorMapToken extends NeutralColorMapToken {
  // Primary
  colorPrimaryBg: string; // 1
  colorPrimaryBgHover: string; // 2
  colorPrimaryBorder: string; // 3
  colorPrimaryBorderHover: string; // 4
  colorPrimaryHover: string; // 5
  colorPrimary: string; // 6
  colorPrimaryActive: string; // 7
  colorPrimaryTextHover: string; // 8
  colorPrimaryText: string; // 9
  colorPrimaryTextActive: string; // 10

  // Success
  colorSuccessBg: string; // 1
  colorSuccessBgHover: string; // 2
  colorSuccessBorder: string; // 3
  colorSuccessBorderHover: string; // 4
  colorSuccessHover: string; // 5
  colorSuccess: string; // 6
  colorSuccessActive: string; // 7
  colorSuccessTextHover: string; // 8
  colorSuccessText: string; // 9
  colorSuccessTextActive: string; // 10

  // Warning
  colorWarningBg: string; // 1
  colorWarningBgHover: string; // 2
  colorWarningBorder: string; // 3
  colorWarningBorderHover: string; // 4
  colorWarningHover: string; // 5
  colorWarning: string; // 6
  colorWarningActive: string; // 7
  colorWarningTextHover: string; // 8
  colorWarningText: string; // 9
  colorWarningTextActive: string; // 10

  // Error
  colorErrorBg: string; // 1
  colorErrorBgHover: string; // 2
  colorErrorBorder: string; // 3
  colorErrorBorderHover: string; // 4
  colorErrorHover: string; // 5
  colorError: string; // 6
  colorErrorActive: string; // 7
  colorErrorTextHover: string; // 8
  colorErrorText: string; // 9
  colorErrorTextActive: string; // 10

  // Info
  colorInfoBg: string; // 1
  colorInfoBgHover: string; // 2
  colorInfoBorder: string; // 3
  colorInfoBorderHover: string; // 4
  colorInfoHover: string; // 5
  colorInfo: string; // 6
  colorInfoActive: string; // 7
  colorInfoTextHover: string; // 8
  colorInfoText: string; // 9
  colorInfoTextActive: string; // 10

  colorBgMask: string;
}

export interface CommonMapToken {
  // Font
  fontSizes: number[];
  lineHeights: number[];

  // Size
  sizeSpace: number;
  sizeSpaceXS: number;
  sizeSpaceXXS: number;
  sizeSpaceSM: number;

  // Grid
  gridSpaceSM: number;
  gridSpaceBase: number;
  gridSpaceLG: number;
  gridSpaceXL: number;
  gridSpaceXXL: number;

  // Line
  lineWidthBold: number;

  // Motion
  motionDurationFast: string;
  motionDurationMid: string;
  motionDurationSlow: string;

  // Radius
  radiusXS: number;
  radiusSM: number;
  radiusLG: number;
  radiusOuter: number;

  // Control
  /** @private Only Used for control inside component like Multiple Select inner selection item */
  controlHeightXS: number;
  controlHeightSM: number;
  controlHeightLG: number;
}

/** Map Token */
export interface MapToken extends SeedToken, ColorPalettes, ColorMapToken, CommonMapToken {}

/** Alias Token */
export interface AliasToken extends MapToken {
  // Background
  colorFillContentHover: string;
  colorFillAlter: string;
  colorBgContainerDisabled: string;
  colorFillContent: string;

  // Border
  colorBorderBg: string;
  colorSplit: string;

  // Text
  colorTextPlaceholder: string;
  colorTextDisabled: string;
  colorTextHeading: string;
  colorTextLabel: string;
  colorTextDescription: string;
  colorBgTextHover: string;
  colorBgTextActive: string;

  /** Weak action. Such as `allowClear` or Alert close button */
  colorIcon: string;
  /** Weak action hover color. Such as `allowClear` or Alert close button */
  colorIconHover: string;

  colorLink: string;
  colorLinkHover: string;
  colorLinkActive: string;

  colorHighlight: string;

  controlOutline: string;
  colorWarningOutline: string;
  colorErrorOutline: string;

  // Font
  fontSizeSM: number;
  fontSize: number;
  fontSizeLG: number;
  fontSizeXL: number;
  /** Operation icon in Select, Cascader, etc. icon fontSize. Normal is same as fontSizeSM */
  fontSizeIcon: number;

  fontSizeHeading1: number;
  fontSizeHeading2: number;
  fontSizeHeading3: number;
  fontSizeHeading4: number;
  fontSizeHeading5: number;

  /** For heading like h1, h2, h3 or option selected item */
  fontWeightStrong: number;

  // LineHeight
  lineHeight: number;
  lineHeightLG: number;
  lineHeightSM: number;

  lineHeightHeading1: number;
  lineHeightHeading2: number;
  lineHeightHeading3: number;
  lineHeightHeading4: number;
  lineHeightHeading5: number;

  // Control
  controlLineWidth: number;
  controlLineType: string;
  controlRadius: number;
  controlRadiusXS: number;
  controlRadiusSM: number;
  controlRadiusLG: number;
  controlOutlineWidth: number;
  controlItemBgHover: string; // Note. It also is a color
  controlItemBgActive: string; // Note. It also is a color
  controlItemBgActiveHover: string; // Note. It also is a color
  controlInteractiveSize: number;
  controlItemBgActiveDisabled: string; // Note. It also is a color

  // =============== Legacy: should be remove ===============
  opacityLoading: number;

  padding: number;
  margin: number;

  boxShadow: string;
  boxShadowSecondary: string;

  linkDecoration: React.CSSProperties['textDecoration'];
  linkHoverDecoration: React.CSSProperties['textDecoration'];
  linkFocusDecoration: React.CSSProperties['textDecoration'];

  controlPaddingHorizontal: number;
  controlPaddingHorizontalSM: number;

  paddingSM: number;
  paddingXS: number;
  paddingXXS: number;
  paddingLG: number;
  paddingXL: number;
  paddingTmp: number;
  marginXXS: number;
  marginXS: number;
  marginSM: number;
  marginLG: number;
  marginXL: number;
  marginXXL: number;
  marginTmp: number;

  // Media queries breakpoints
  screenXS: number;
  screenXSMin: number;
  screenXSMax: number;
  screenSM: number;
  screenSMMin: number;
  screenSMMax: number;
  screenMD: number;
  screenMDMin: number;
  screenMDMax: number;
  screenLG: number;
  screenLGMin: number;
  screenLGMax: number;
  screenXL: number;
  screenXLMin: number;
  screenXLMax: number;
  screenXXL: number;
  screenXXLMin: number;
  screenXXLMax: number;

  /** Used for DefaultButton, Switch which has default outline */
  controlTmpOutline: string;

  // FIXME: component box-shadow, should be removed
  boxShadowPopoverArrow: string;
  boxShadowCard: string;
  boxShadowDrawerRight: string;
  boxShadowDrawerLeft: string;
  boxShadowDrawerUp: string;
  boxShadowDrawerDown: string;
  boxShadowTabsOverflowLeft: string;
  boxShadowTabsOverflowRight: string;
  boxShadowTabsOverflowTop: string;
  boxShadowTabsOverflowBottom: string;
}
