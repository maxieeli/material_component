import { createTheme } from '@developerli/styled'
import { FormProvider as RcFormProvider } from 'rc-field-form'
import type { ValidateMessages } from 'rc-field-form/lib/interface'
import useMemo from 'rc-util/lib/hooks/useMemo'
import * as React from 'react'
import type { RequiredMark } from '../Form/Form'
import type { Locale } from '../LocaleProvider'
import LocaleProvider from '../LocaleProvider'
import LocaleReceiver from '../LocaleProvider/LocaleReceiver'
import defaultLocale from '../locale/default'
import { DesignTokenContext } from '../theme'
import defaultSeedToken from '../theme/themes/seed'
import type { ConfigConsumerProps, Theme, ThemeConfig } from './context'
import { ConfigConsumer, ConfigContext } from './context'
import { registerTheme } from './cssVars'
import { RenderEmptyHandler } from './renderEmpty'
import useTheme from './hooks/useTheme'
import type { SizeType } from './SizeContext'
import SizeContext, { SizeContextProvider } from './SizeContext'

export {
  RenderEmptyHandler,
  ConfigContext,
  ConfigConsumer,
}

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'locale',
]

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: Exclude<keyof ConfigConsumerProps, 'rootPrefixCls' | 'getPrefixCls'>[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'pagination',
  'form',
]

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement | Window
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  prefixCls?: string
  iconPrefixCls?: string
  children?: React.ReactNode
  renderEmpty?: RenderEmptyHandler
  form?: {
    validateMessages?: ValidateMessages
    requiredMark?: RequiredMark
    colon?: boolean
  }
  pagination?: {
    showSizeChanger?: boolean
  }
  locale?: Locale
  componentSize?: SizeType
  gap?: {
    size?: SizeType | number
  }
  virtual?: boolean
  dropdownMatchSelectWidth?: boolean
  theme?: ThemeConfig
}

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps
  legacyLocale: Locale
}

export const defaultPrefixCls = 'mui'
let globalPrefixCls: string
let globalIconPrefixCls: string

function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls
}

function getGlobalIconPrefixCls() {
  return globalIconPrefixCls
}

const setGlobalConfig = ({
  prefixCls,
  iconPrefixCls,
  theme,
}: Pick<ConfigProviderProps, 'prefixCls' | 'iconPrefixCls'> & { theme?: Theme }) => {
  if (prefixCls !== undefined) {
    globalPrefixCls = prefixCls
  }
  if (iconPrefixCls !== undefined) {
    globalIconPrefixCls = iconPrefixCls
  }

  if (theme) {
    registerTheme(getGlobalPrefixCls(), theme)
  }
}

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls()
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalPrefixCls) {
      return globalPrefixCls
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls()
  },
})

const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const {
    children,
    form,
    locale,
    componentSize,
    gap,
    virtual,
    dropdownMatchSelectWidth,
    legacyLocale,
    parentContext,
    iconPrefixCls: customIconPrefixCls,
    theme,
  } = props

  const getPrefixCls = React.useCallback(
    (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls } = props

      if (customizePrefixCls) return customizePrefixCls

      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('')

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    },
    [parentContext.getPrefixCls, props.prefixCls],
  )

  const iconPrefixCls = customIconPrefixCls || parentContext.iconPrefixCls
  const mergedTheme = useTheme(theme, parentContext.theme)

  const config = {
    ...parentContext,
    locale: locale || legacyLocale,
    gap,
    virtual,
    dropdownMatchSelectWidth,
    getPrefixCls,
    iconPrefixCls,
    theme: mergedTheme,
  }

  PASSED_PROPS.forEach((propName) => {
    const propValue = props[propName]
    if (propValue) {
      (config as any)[propName] = propValue
    }
  })

  const memoedConfig = useMemo(
    () => config,
    config,
    (prevConfig, currentConfig) => {
      const prevKeys = Object.keys(prevConfig) as Array<keyof typeof config>
      const currentKeys = Object.keys(currentConfig) as Array<keyof typeof config>
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      )
    },
  )

  const memoIconContextValue = React.useMemo(
    () => ({ prefixCls: iconPrefixCls }),
    [iconPrefixCls],
  )

  let childNode = children
  // Additional Form provider
  let validateMessages: ValidateMessages = {}

  if (locale) {
    validateMessages =
      locale.Form?.defaultValidateMessages || defaultLocale.Form?.defaultValidateMessages || {}
  }
  if (form && form.validateMessages) {
    validateMessages = { ...validateMessages, ...form.validateMessages }
  }

  if (Object.keys(validateMessages).length > 0) {
    childNode = <RcFormProvider validateMessages={validateMessages}>{children}</RcFormProvider>
  }

  if (locale) {
    childNode = (
      <LocaleProvider locale={locale}>
        {childNode}
      </LocaleProvider>
    )
  }

  if (componentSize) {
    childNode = <SizeContextProvider size={componentSize}>{childNode}</SizeContextProvider>
  }

  // Dynamic theme
  const memoTheme = React.useMemo(() => {
    const { algorithm, token, ...rest } = mergedTheme || {}
    const themeObj =
      algorithm && (!Array.isArray(algorithm) || algorithm.length > 0)
        ? createTheme(algorithm)
        : undefined

    return {
      ...rest,
      theme: themeObj,

      token: {
        ...defaultSeedToken,
        ...token,
      },
    }
  }, [mergedTheme])

  if (theme) {
    childNode = (
      <DesignTokenContext.Provider value={memoTheme}>{childNode}</DesignTokenContext.Provider>
    )
  }

  return <ConfigContext.Provider value={memoedConfig}>{childNode}</ConfigContext.Provider>
}

const ConfigProvider: React.FC<ConfigProviderProps> & {
  ConfigContext: typeof ConfigContext
  SizeContext: typeof SizeContext
  config: typeof setGlobalConfig
} = (props) => (
  <LocaleReceiver>
    {(_, __, legacyLocale) => (
      <ConfigConsumer>
        {(context) => (
          <ProviderChildren
            parentContext={context}
            legacyLocale={legacyLocale as Locale}
            {...props}
          />
        )}
      </ConfigConsumer>
    )}
  </LocaleReceiver>
)

ConfigProvider.ConfigContext = ConfigContext
ConfigProvider.SizeContext = SizeContext
ConfigProvider.config = setGlobalConfig

export default ConfigProvider
