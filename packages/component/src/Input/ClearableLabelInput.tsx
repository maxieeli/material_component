import classNames from 'classnames'
import * as React from 'react'
import { Cancel } from '@mui/icons-material'
import type { SizeType } from '../Provider/SizeContext'
import type { FormItemStatusContextProps } from '../Form/context'
import { FormItemInputContext } from '../Form/context'
import { cloneElement } from '../utils/reactNode'
import type { InputStatus } from '../utils/statusUtils'
import { getMergedStatus, getStatusClassNames } from '../utils/statusUtils'
import { tuple } from '../utils/type'
import type { InputProps } from './Input'

const ClearableInputType = tuple('text', 'input')

function hasAddon(props: InputProps | ClearableInputProps) {
  return !!(props.addonBefore || props.addonAfter)
}

/** This basic props required for input and textarea. */
interface BasicProps {
  prefixCls: string
  inputType: typeof ClearableInputType[number]
  value?: any
  allowClear?: boolean
  element: React.ReactElement
  handleReset: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  focused?: boolean
  readOnly?: boolean
  bordered: boolean
  hidden?: boolean
}

/** This props only for input. */
export interface ClearableInputProps extends BasicProps {
  size?: SizeType
  suffix?: React.ReactNode
  prefix?: React.ReactNode
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  triggerFocus?: () => void
  status?: InputStatus
  hashId?: string
}

class ClearableLabeledInput extends React.Component<ClearableInputProps> {
  renderClearIcon(prefixCls: string) {
    const { value, disabled, readOnly, handleReset, suffix } = this.props
    const needClear = !disabled && !readOnly && value
    const className = `${prefixCls}-clear-icon`
    return (
      <span onClick={handleReset} onMouseDown={e => e.preventDefault()}>
        <Cancel
          className={classNames(
            {
              [`${className}-hidden`]: !needClear,
              [`${className}-has-suffix`]: !!suffix,
            },
            className,
          )}
          role="button"
        />
      </span>
    )
  }

  renderTextAreaWithClearIcon(
    prefixCls: string,
    element: React.ReactElement,
    statusContext: FormItemStatusContextProps,
  ) {
    const {
      value,
      allowClear,
      className,
      style,
      bordered,
      hidden,
      status: customStatus,
      hashId,
    } = this.props

    const { status: contextStatus, hasFeedback } = statusContext

    if (!allowClear) {
      return cloneElement(element, {
        value,
      })
    }
    const affixWrapperCls = classNames(
      `${prefixCls}-affix-wrapper`,
      `${prefixCls}-affix-wrapper-textarea-with-clear-btn`,
      getStatusClassNames(
        `${prefixCls}-affix-wrapper`,
        getMergedStatus(contextStatus, customStatus),
        hasFeedback,
      ),
      {
        [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
        // className will go to addon wrapper
        [`${className}`]: !hasAddon(this.props) && className,
      },
      hashId,
    )
    return (
      <span className={affixWrapperCls} style={style} hidden={hidden}>
        {cloneElement(element, {
          style: null,
          value,
        })}
        {this.renderClearIcon(prefixCls)}
      </span>
    )
  }

  render() {
    return (
      <FormItemInputContext.Consumer>
        {statusContext => {
          const { prefixCls, inputType, element } = this.props
          if (inputType === ClearableInputType[0]) {
            return this.renderTextAreaWithClearIcon(prefixCls, element, statusContext)
          }
        }}
      </FormItemInputContext.Consumer>
    )
  }
}

export default ClearableLabeledInput
