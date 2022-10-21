import * as React from 'react'
import { forwardRef, useContext, useImperativeHandle } from 'react'
import classNames from 'classnames'
import {
  CalendarToday, AccessTime,
  CancelOutlined, ArrowRightAltOutlined,
} from '@mui/icons-material'
import { RangePicker as BasicRangePicker } from '@developerli/basic-picker'
import type { GenerateConfig } from '@developerli/basic-picker/es/generate/index'
import type { RangePickerProps } from '.'
import { Components, getTimeProps } from '.'
import { ConfigContext } from '../../Provider'
import DisabledContext from '../../Provider/DisabledContext'
import SizeContext from '../../Provider/SizeContext'
import { FormItemInputContext } from '../../Form/context'
import LocaleReceiver from '../../LocaleProvider/LocaleReceiver'
import { getMergedStatus, getStatusClassNames } from '../../utils/statusUtils'
import enUS from '../locale/date_EN_US'
import { getRangePlaceholder, transPlacement2DropdownAlign } from '../util'
import type { CommonPickerMethods, PickerComponentClass } from './interface'

import useStyle from '../styled'

export default function generateRangePicker<DateType>(
  generateConfig: GenerateConfig<DateType>,
): PickerComponentClass<RangePickerProps<DateType>> {
  type InternalRangePickerProps = RangePickerProps<DateType> & {}

  const RangePicker = forwardRef<
    InternalRangePickerProps | CommonPickerMethods,
    RangePickerProps<DateType> & {
      popupClassName?: string
      /** @deprecated Please use `popupClassName` instead */
      dropdownClassName?: string
    }
  >((props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      getPopupContainer: customGetPopupContainer,
      className,
      placement,
      size: customizeSize,
      disabled: customDisabled,
      bordered = true,
      placeholder,
      popupClassName,
      status: customStatus,
      ...restProps
    } = props

    const innerRef = React.useRef<BasicRangePicker<DateType>>(null)
    const { getPrefixCls, getPopupContainer } = useContext(ConfigContext)
    const prefixCls = getPrefixCls('picker', customizePrefixCls)
    const { format, showTime, picker } = props as any
    const rootPrefixCls = getPrefixCls()

    const [wrapSSR, hashId] = useStyle(prefixCls)

    let additionalOverrideProps: any = {}
    additionalOverrideProps = {
      ...additionalOverrideProps,
      ...(showTime ? getTimeProps({ format, picker, ...showTime }) : {}),
      ...(picker === 'time' ? getTimeProps({ format, ...props, picker }) : {}),
    }

    // ===================== Size =====================
    const size = React.useContext(SizeContext)
    const mergedSize = customizeSize || size

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext)
    const mergedDisabled = customDisabled ?? disabled

    // ===================== FormItemInput =====================
    const formItemContext = useContext(FormItemInputContext)
    const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext

    const suffixNode = (
      <>
        {picker === 'time' ? <AccessTime /> : <CalendarToday />}
        {hasFeedback && feedbackIcon}
      </>
    )

    useImperativeHandle(ref, () => ({
      focus: () => innerRef.current?.focus(),
      blur: () => innerRef.current?.blur(),
    }))

    return wrapSSR(
      <LocaleReceiver componentName="DatePicker" defaultLocale={enUS}>
        {contextLocale => {
          const locale = { ...contextLocale, ...props.locale }

          return (
            <BasicRangePicker<DateType>
              separator={
                <span aria-label="to" className={`${prefixCls}-separator`}>
                  <ArrowRightAltOutlined />
                </span>
              }
              disabled={mergedDisabled}
              ref={innerRef}
              dropdownAlign={transPlacement2DropdownAlign(placement)}
              placeholder={getRangePlaceholder(picker, locale, placeholder)}
              suffixIcon={suffixNode}
              clearIcon={<CancelOutlined />}
              prevIcon={<span className={`${prefixCls}-prev-icon`} />}
              nextIcon={<span className={`${prefixCls}-next-icon`} />}
              superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
              superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
              allowClear
              transitionName={`${rootPrefixCls}-slide-up`}
              {...restProps}
              {...additionalOverrideProps}
              className={classNames(
                {
                  [`${prefixCls}-${mergedSize}`]: mergedSize,
                  [`${prefixCls}-borderless`]: !bordered,
                },
                getStatusClassNames(
                  prefixCls as string,
                  getMergedStatus(contextStatus, customStatus),
                  hasFeedback,
                ),
                hashId,
                className,
              )}
              locale={locale!.lang}
              prefixCls={prefixCls}
              getPopupContainer={customGetPopupContainer || getPopupContainer}
              generateConfig={generateConfig}
              components={Components}
              dropdownClassName={classNames(hashId, popupClassName)}
            />
          )
        }}
      </LocaleReceiver>,
    )
  })

  return RangePicker as unknown as PickerComponentClass<RangePickerProps<DateType>>
}
