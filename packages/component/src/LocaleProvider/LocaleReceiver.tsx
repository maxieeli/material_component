import * as React from 'react';
import type { Locale } from '.';
import type { LocaleContextProps } from './context';
import LocaleContext from './context';
import defaultLocaleData from '../locale/default';

export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;

export interface LocaleReceiverProps<C extends LocaleComponentName = LocaleComponentName> {
  componentName: C;
  defaultLocale?: Locale[C] | (() => Locale[C]);
  children: (locale: Locale[C], localeCode?: string, fullLocale?: object) => React.ReactNode;
}

export default class LocaleReceiver<
  C extends LocaleComponentName = LocaleComponentName,
> extends React.Component<LocaleReceiverProps<C>> {
  static defaultProps = {
    componentName: 'global',
  };

  static contextType = LocaleContext;
  // @ts-ignore
  context: LocaleContextProps;

  getLocale(): Locale[C] {
    const { componentName, defaultLocale } = this.props;
    const locale = defaultLocale || defaultLocaleData[componentName ?? 'global'];
    const muiLocale = this.context;
    const localeFromContext = componentName && muiLocale ? muiLocale[componentName] : {};
    return {
      ...(locale instanceof Function ? locale() : locale),
      ...(localeFromContext || {}),
    };
  }

  getLocaleCode() {
    const muiLocale = this.context;
    const localeCode = muiLocale && muiLocale.locale;
    // Had use LocaleProvide but didn't set locale
    if (muiLocale && muiLocale.exist && !localeCode) {
      return defaultLocaleData.locale;
    }
    return localeCode;
  }

  render() {
    return this.props.children(this.getLocale(), this.getLocaleCode(), this.context);
  }
}

export function useLocaleReceiver<T extends LocaleComponentName>(
  componentName: T,
  defaultLocale?: Locale[T] | Function,
): [Locale[T]] {
  const muiLocale = React.useContext(LocaleContext);

  const componentLocale = React.useMemo(() => {
    const locale = defaultLocale || defaultLocaleData[componentName || 'global'];
    const localeFromContext = componentName && muiLocale ? muiLocale[componentName] : {};

    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
    };
  }, [componentName, defaultLocale, muiLocale]);

  return [componentLocale];
}
