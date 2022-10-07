import { generate } from '../colors';
import { TinyColor } from '@ctrl/tinycolor';
import canUseDom from 'rc-util/lib/Dom/canUseDom';
import { updateCSS } from 'rc-util/lib/Dom/dynamicCSS';
import type { Theme } from './context';

const dynamicStyleMark = `-mui-${Date.now()}-${Math.random()}`;

export function getStyle(globalPrefixCls: string, theme: Theme) {
  const variables: Record<string, string> = {};

  const formatColor = (
    color: TinyColor,
    updater?: (cloneColor: TinyColor) => TinyColor | undefined,
  ) => {
    let clone = color.clone();
    clone = updater?.(clone) || clone;
    return clone.toRgbString();
  };

  const fillColor = (colorVal: string, type: string) => {
    const baseColor = new TinyColor(colorVal);
    const colorPalettes = generate(baseColor.toRgbString());

    variables[`${type}-color`] = formatColor(baseColor);
    variables[`${type}-color-disabled`] = colorPalettes[1];
    variables[`${type}-color-hover`] = colorPalettes[4];
    variables[`${type}-color-active`] = colorPalettes[6];
    variables[`${type}-color-outline`] = baseColor.clone().setAlpha(0.2).toRgbString();
    variables[`${type}-color-deprecated-bg`] = colorPalettes[0];
    variables[`${type}-color-deprecated-border`] = colorPalettes[2];
  };

  // ================ Primary Color ================
  if (theme.primaryColor) {
    fillColor(theme.primaryColor, 'primary');

    const primaryColor = new TinyColor(theme.primaryColor);
    const primaryColors = generate(primaryColor.toRgbString());

    // Legacy - We should use semantic naming standard
    primaryColors.forEach((color, index) => {
      variables[`primary-${index + 1}`] = color;
    });
  }

  // ================ Success Color ================
  if (theme.successColor) {
    fillColor(theme.successColor, 'success');
  }

  // ================ Warning Color ================
  if (theme.warningColor) {
    fillColor(theme.warningColor, 'warning');
  }

  // ================= Error Color =================
  if (theme.errorColor) {
    fillColor(theme.errorColor, 'error');
  }

  // ================= Info Color ==================
  if (theme.infoColor) {
    fillColor(theme.infoColor, 'info');
  }

  // Convert to css variables
  const cssList = Object.keys(variables).map(
    key => `--${globalPrefixCls}-${key}: ${variables[key]};`,
  );

  return `
  :root {
    ${cssList.join('\n')}
  }
  `.trim();
}

export function registerTheme(globalPrefixCls: string, theme: Theme) {
  const style = getStyle(globalPrefixCls, theme);

  if (canUseDom()) {
    updateCSS(style, `${dynamicStyleMark}-dynamic-theme`);
  }
}
