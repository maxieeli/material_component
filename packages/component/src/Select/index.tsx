import * as React from 'react'
import { useContext } from 'react'
import classNames from 'classnames'
import type { SelectProps as BasicSelectProps } from '@developerli/basic-select'
import BasicSelect, { BaseSelectRef, OptGroup, Option } from '@developerli/basic-select'
import { OptionProps } from '@developerli/basic-select/es/Option'
import type { BaseOptionType, DefaultOptionType } from '@developerli/basic-select/es/Select'
import omit from 'rc-util/lib/omit'
import { ConfigContext } from '../Provider'
import defaultRenderEmpty from '../Provider/renderEmpty'
import DisabledContext from '../Provider/DisabledContext'
import type { SizeType } from '../Provider/SizeContext'
import SizeContext from '../Provider/SizeContext'
import { FormItemInputContext } from '../Form/context'
import type { SelectCommonPlacement } from '../utils/motion'
import { getTransitionDirection, getTransitionName } from '../utils/motion'
import type { InputStatus } from '../utils/statusUtils'
import { getMergedStatus, getStatusClassNames } from '../utils/statusUtils'
import getIcons from './utils/iconUtil'
import genPurePanel from '../utils/PurePanel'

import useStyle from './styled'

type RawValue = string | number

export { OptionProps, BaseSelectRef as RefSelectProps, BaseOptionType, DefaultOptionType }

export interface LabeledValue {
  key?: string
  value: RawValue
  label: React.ReactNode
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined

export interface InternalSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> extends Omit<BasicSelectProps<ValueType, OptionType>, 'mode'> {
  suffixIcon?: React.ReactNode
  size?: SizeType
  disabled?: boolean
  mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'
  bordered?: boolean
}

export interface SelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> extends Omit<
    InternalSelectProps<ValueType, OptionType>,
    'inputIcon' | 'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement'
  > {
  placement?: SelectCommonPlacement
  mode?: 'multiple' | 'tags'
  status?: InputStatus
  popupClassName?: string
}

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE'

const InternalSelect = <OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  {
    prefixCls: customizePrefixCls,
    bordered = true,
    className,
    getPopupContainer,
    popupClassName,
    dropdownClassName,
    listHeight = 256,
    placement,
    listItemHeight = 24,
    size: customizeSize,
    disabled: customDisabled,
    notFoundContent,
    status: customStatus,
    showArrow,
    ...props
  }: SelectProps<OptionType>,
  ref: React.Ref<BaseSelectRef>,
) => {
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    virtual,
    dropdownMatchSelectWidth,
  } = React.useContext(ConfigContext)
  const size = React.useContext(SizeContext)

  const prefixCls = getPrefixCls('select', customizePrefixCls)
  const rootPrefixCls = getPrefixCls()

  const [wrapSSR, hashId] = useStyle(prefixCls)

  const mode = React.useMemo(() => {
    const { mode: m } = props as InternalSelectProps<OptionType>

    if ((m as any) === 'combobox') {
      return undefined
    }

    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return 'combobox'
    }

    return m
  }, [props.mode])

  const isMultiple = mode === 'multiple' || mode === 'tags'
  const mergedShowArrow =
    showArrow !== undefined ? showArrow : props.loading || !(isMultiple || mode === 'combobox')

  // ===================== Form Status =====================
  const {
    status: contextStatus,
    hasFeedback,
    isFormItemInput,
    feedbackIcon,
  } = useContext(FormItemInputContext)
  const mergedStatus = getMergedStatus(contextStatus, customStatus)

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent
  } else if (mode === 'combobox') {
    mergedNotFound = null
  } else {
    mergedNotFound = (renderEmpty || defaultRenderEmpty)('Select')
  }

  // ===================== Icons =====================
  const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    multiple: isMultiple,
    hasFeedback,
    feedbackIcon,
    showArrow: mergedShowArrow,
    prefixCls,
  })

  const selectProps = omit(props as typeof props & { itemIcon: any }, ['suffixIcon', 'itemIcon'])

  const basicSelectDropdownClassName = classNames(
    popupClassName || dropdownClassName,
    hashId,
  )

  const mergedSize = customizeSize || size

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext)
  const mergedDisabled = customDisabled ?? disabled

  const mergedClassName = classNames(
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-in-form-item`]: isFormItemInput,
    },
    getStatusClassNames(prefixCls, mergedStatus, hasFeedback),
    className,
    hashId,
  )

  // ===================== Placement =====================
  const getPlacement = () => {
    if (placement !== undefined) {
      return placement
    }
    return ('bottomLeft' as SelectCommonPlacement)
  }

  // ====================== Render =======================
  return wrapSSR(
    <BasicSelect<any, any>
      ref={ref as any}
      virtual={virtual}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      {...selectProps}
      transitionName={getTransitionName(
        rootPrefixCls,
        getTransitionDirection(placement),
        props.transitionName,
      )}
      listHeight={listHeight}
      listItemHeight={listItemHeight}
      mode={mode as any}
      prefixCls={prefixCls}
      placement={getPlacement()}
      inputIcon={suffixIcon}
      menuItemSelectedIcon={itemIcon}
      removeIcon={removeIcon}
      clearIcon={clearIcon}
      notFoundContent={mergedNotFound}
      className={mergedClassName}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
      dropdownClassName={basicSelectDropdownClassName}
      showArrow={hasFeedback || showArrow}
      disabled={mergedDisabled}
    />,
  )
}

const Select = React.forwardRef(InternalSelect) as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(
  props: React.PropsWithChildren<SelectProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>
  },
) => React.ReactElement) & {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: string
  Option: typeof Option
  OptGroup: typeof OptGroup
  _InternalPanel: typeof PurePanel
}

const PurePanel = genPurePanel(Select)

Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE
Select.Option = Option
Select.OptGroup = OptGroup
Select._InternalPanel = PurePanel

export default Select
