import * as React from 'react'
import { useContext } from 'react'
import classNames from 'classnames'
import BasicCheckbox from '@developerli/basic-checkbox'
import { ConfigContext } from '../Provider'
import { FormItemInputContext } from '../Form/context'
import { GroupContext } from './Group'
import DisabledContext from '../Provider/DisabledContext'
import useStyle from './styled'

export interface AbstractCheckboxProps<T> {
  prefixCls?: string
  className?: string
  defaultChecked?: boolean
  checked?: boolean
  style?: React.CSSProperties
  disabled?: boolean
  onChange?: (e: T) => void
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  onKeyPress?: React.KeyboardEventHandler<HTMLElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
  value?: any
  tabIndex?: number
  name?: string
  children?: React.ReactNode
  id?: string
  autoFocus?: boolean
  type?: string
  skipGroup?: boolean
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: MouseEvent
}

export interface CheckboxProps extends AbstractCheckboxProps<CheckboxChangeEvent> {
  indeterminate?: boolean
}

const InternalCheckbox: React.ForwardRefRenderFunction<HTMLInputElement, CheckboxProps> = (
  {
    prefixCls: customizePrefixCls,
    className,
    children,
    indeterminate = false,
    style,
    onMouseEnter,
    onMouseLeave,
    skipGroup = false,
    disabled,
    ...restProps
  },
  ref,
) => {
  const { getPrefixCls } = React.useContext(ConfigContext)
  const checkboxGroup = React.useContext(GroupContext)
  const { isFormItemInput } = useContext(FormItemInputContext)
  const contextDisabled = useContext(DisabledContext)
  const mergedDisabled = (checkboxGroup?.disabled || disabled) ?? contextDisabled

  const prevValue = React.useRef(restProps.value)

  React.useEffect(() => {
    checkboxGroup?.registerValue(restProps.value)
  }, [])

  React.useEffect(() => {
    if (skipGroup) {
      return
    }
    if (restProps.value !== prevValue.current) {
      checkboxGroup?.cancelValue(prevValue.current)
      checkboxGroup?.registerValue(restProps.value)
      prevValue.current = restProps.value
    }
    return () => checkboxGroup?.cancelValue(restProps.value)
  }, [restProps.value])

  const prefixCls = getPrefixCls('checkbox', customizePrefixCls)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const checkboxProps: CheckboxProps = { ...restProps }
  if (checkboxGroup && !skipGroup) {
    checkboxProps.onChange = (...args) => {
      if (restProps.onChange) {
        restProps.onChange(...args)
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({ label: children, value: restProps.value })
      }
    }
    checkboxProps.name = checkboxGroup.name
    checkboxProps.checked = checkboxGroup.value.includes(restProps.value)
  }
  const classString = classNames(
    {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
      [`${prefixCls}-wrapper-disabled`]: mergedDisabled,
      [`${prefixCls}-wrapper-in-form-item`]: isFormItemInput,
    },
    className,
    hashId,
  )
  const checkboxClass = classNames(
    {
      [`${prefixCls}-indeterminate`]: indeterminate,
    },
    hashId,
  )
  const ariaChecked = indeterminate ? 'mixed' : undefined
  return wrapSSR(
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classString}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BasicCheckbox
        aria-checked={ariaChecked}
        {...checkboxProps}
        prefixCls={prefixCls}
        className={checkboxClass}
        disabled={mergedDisabled}
        ref={ref}
      />
      {children !== undefined && <span>{children}</span>}
    </label>,
  )
}

const Checkbox = React.forwardRef<unknown, CheckboxProps>(InternalCheckbox)
Checkbox.displayName = 'Checkbox'

export default Checkbox
