import * as React from 'react'
import type { Locale } from '.'
import type { LocaleContextProps } from './context'
import LocaleContext from './context'
import defaultLocaleData from '../locale/default'

export type LocaleComponentName = Exclude<keyof Locale, 'locale'>

export interface LocaleReceiverProps<C extends LocaleComponentName = LocaleComponentName> {
  componentName?: C
  defaultLocale?: Locale[C] | (() => Locale[C])
  children: (
    locale: NonNullable<Locale[C]>,
    localeCode: string,
    fullLocale: Locale,
  ) => React.ReactElement
}

const LocaleReceiver = <C extends LocaleComponentName = LocaleComponentName>(
  props: LocaleReceiverProps<C>,
) => {
  const { componentName = 'global' as C, defaultLocale, children } = props
  const muiLocale = React.useContext<LocaleContextProps | undefined>(LocaleContext)

  const getLocale = React.useMemo<NonNullable<Locale[C]>>(() => {
    const locale = defaultLocale || defaultLocaleData[componentName]
    const localeFromContext = muiLocale?.[componentName] ?? {}
    return {
      ...(locale instanceof Function ? locale() : locale),
      ...(localeFromContext || {}),
    }
  }, [componentName, defaultLocale, muiLocale])

  const getLocaleCode = React.useMemo<string>(() => {
    const localeCode = muiLocale && muiLocale.locale
    if (muiLocale && muiLocale.exist && !localeCode) {
      return defaultLocaleData.locale
    }
    return localeCode!
  }, [muiLocale])

  return children(getLocale, getLocaleCode, muiLocale!)
}

export default LocaleReceiver

export const useLocaleReceiver = <C extends LocaleComponentName = LocaleComponentName>(
  componentName: C,
  defaultLocale?: Locale[C] | (() => Locale[C]),
): [Locale[C]] => {
  const muiLocale = React.useContext<LocaleContextProps | undefined>(LocaleContext)

  const getLocale = React.useMemo<NonNullable<Locale[C]>>(() => {
    const locale = defaultLocale || defaultLocaleData[componentName]
    const localeFromContext = muiLocale?.[componentName] ?? {}
    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
    }
  }, [componentName, defaultLocale, muiLocale])

  return [getLocale]
}
