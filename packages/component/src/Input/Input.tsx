import React, { forwardRef, useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { Close } from '@mui/icons-material'
import type { InputProps as RcInputProps, InputRef } from '@developerli/basic-input'
import RcInput from '@developerli/basic-input'
import type { BaseInputProps } from '@developerli/basic-input/es/interface'
import { composeRef } from 'rc-util/lib/ref'
import { ConfigContext } from '../Provider'
import DisabledContext from '../Provider/DisabledContext'
import type { SizeType } from '../Provider/SizeContext'
import SizeContext from '../Provider/SizeContext'
import { FormItemInputContext, NoFormStyle } from '../Form/context'
import type { InputStatus } from '../utils/statusUtils'
import { getMergedStatus, getStatusClassNames } from '../utils/statusUtils'
import { hasPrefixSuffix } from './utils'

// CSSINJS
import useStyle from './styled'

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all'
}

export type { InputRef }

export function fixControlledValue<T>(value: T) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return String(value)
}

export function resolveOnChange<E extends HTMLInputElement | HTMLTextAreaElement>(
  target: E,
  e:
    | React.ChangeEvent<E>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.CompositionEvent<HTMLElement>,
  onChange: undefined | ((event: React.ChangeEvent<E>) => void),
  targetValue?: string,
) {
  if (!onChange) {
    return
  }
  let event = e as React.ChangeEvent<E>

  if (e.type === 'click') {
    const currentTarget = target.cloneNode(true) as E
    // click clear icon
    event = Object.create(e, {
      target: { value: currentTarget },
      currentTarget: { value: currentTarget },
    })

    currentTarget.value = ''
    onChange(event)
    return
  }

  // Trigger by composition event, this means we need force change the input value
  if (targetValue !== undefined) {
    event = Object.create(e, {
      target: { value: target },
      currentTarget: { value: target },
    })

    target.value = targetValue
    onChange(event)
    return
  }
  onChange(event)
}

export function triggerFocus(
  element?: HTMLInputElement | HTMLTextAreaElement,
  option?: InputFocusOptions,
) {
  if (!element) {
    return
  }

  element.focus(option)

  // Selection content
  const { cursor } = option || {}
  if (cursor) {
    const len = element.value.length

    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0)
        break
      case 'end':
        element.setSelectionRange(len, len)
        break
      default:
        element.setSelectionRange(0, len)
        break
    }
  }
}

export interface InputProps
  extends Omit<
    RcInputProps,
    'wrapperClassName' | 'groupClassName' | 'inputClassName' | 'affixWrapperClassName'
  > {
  size?: SizeType
  disabled?: boolean
  status?: InputStatus
  bordered?: boolean
  [key: `data-${string}`]: string | undefined
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    bordered = true,
    status: customStatus,
    size: customSize,
    disabled: customDisabled,
    onBlur,
    onFocus,
    suffix,
    allowClear,
    addonAfter,
    addonBefore,
    onChange,
    ...rest
  } = props
  const { getPrefixCls, input } = React.useContext(ConfigContext)

  const prefixCls = getPrefixCls('input', customizePrefixCls)
  const inputRef = useRef<InputRef>(null)

  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls)

  // ===================== Size =====================
  const size = React.useContext(SizeContext)
  const mergedSize = customSize || size

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext)
  const mergedDisabled = customDisabled ?? disabled

  // ===================== Status =====================
  const { status: contextStatus, hasFeedback, feedbackIcon } = useContext(FormItemInputContext)
  const mergedStatus = getMergedStatus(contextStatus, customStatus)

  // ===================== Focus warning =====================
  const inputHasPrefixSuffix = hasPrefixSuffix(props) || !!hasFeedback
  const prevHasPrefixSuffix = useRef<boolean>(inputHasPrefixSuffix)
  useEffect(() => {
    prevHasPrefixSuffix.current = inputHasPrefixSuffix
  }, [inputHasPrefixSuffix])

  // ===================== Remove Password value =====================
  const removePasswordTimeoutRef = useRef<number[]>([])
  const removePasswordTimeout = () => {
    removePasswordTimeoutRef.current.push(
      window.setTimeout(() => {
        if (
          inputRef.current?.input &&
          inputRef.current?.input.getAttribute('type') === 'password' &&
          inputRef.current?.input.hasAttribute('value')
        ) {
          inputRef.current?.input.removeAttribute('value')
        }
      }),
    )
  }

  useEffect(() => {
    removePasswordTimeout()
    return () => removePasswordTimeoutRef.current.forEach(item => window.clearTimeout(item))
  }, [])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout()
    onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout()
    onFocus?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    removePasswordTimeout()
    onChange?.(e)
  }

  const suffixNode = (hasFeedback || suffix) && (
    <>
      {suffix}
      {hasFeedback && feedbackIcon}
    </>
  )

  // Allow clear
  let mergedAllowClear: BaseInputProps['allowClear']
  if (typeof allowClear === 'object' && allowClear?.clearIcon) {
    mergedAllowClear = allowClear
  } else if (allowClear) {
    mergedAllowClear = { clearIcon: <Close /> }
  }

  return wrapSSR(
    <RcInput
      ref={composeRef(ref, inputRef)}
      prefixCls={prefixCls}
      autoComplete={input?.autoComplete}
      {...rest}
      disabled={mergedDisabled || undefined}
      onBlur={handleBlur}
      onFocus={handleFocus}
      suffix={suffixNode}
      allowClear={mergedAllowClear}
      onChange={handleChange}
      addonAfter={
        addonAfter && (
          <NoFormStyle override status>
            {addonAfter}
          </NoFormStyle>
        )
      }
      addonBefore={
        addonBefore && (
          <NoFormStyle override status>
            {addonBefore}
          </NoFormStyle>
        )
      }
      inputClassName={classNames(
        {
          [`${prefixCls}-sm`]: mergedSize === 'small',
          [`${prefixCls}-lg`]: mergedSize === 'large',
          [`${prefixCls}-borderless`]: !bordered,
        },
        !inputHasPrefixSuffix && getStatusClassNames(prefixCls, mergedStatus),
        hashId,
      )}
      affixWrapperClassName={classNames(
        {
          [`${prefixCls}-affix-wrapper-sm`]: mergedSize === 'small',
          [`${prefixCls}-affix-wrapper-lg`]: mergedSize === 'large',
          [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
        },
        getStatusClassNames(`${prefixCls}-affix-wrapper`, mergedStatus, hasFeedback),
        hashId,
      )}
      wrapperClassName={classNames(
        hashId,
      )}
      groupClassName={classNames(
        {
          [`${prefixCls}-group-wrapper-sm`]: mergedSize === 'small',
          [`${prefixCls}-group-wrapper-lg`]: mergedSize === 'large',
        },
        getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus, hasFeedback),
        hashId,
      )}
    />,
  )
})

export default Input
