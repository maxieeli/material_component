import * as React from 'react'
import { forwardRef, useContext, useImperativeHandle } from 'react'
import classNames from 'classnames'
import { AccessTime, CalendarToday, CancelOutlined } from '@mui/icons-material'
import BasicPicker from '@developerli/basic-picker'
import type { GenerateConfig } from '@developerli/basic-picker/es/generate/index'
import type { PickerMode } from '@developerli/basic-picker/es/interface'
import type { PickerDateProps, PickerProps, PickerTimeProps } from '.'
import { Components, getTimeProps } from '.'
import { ConfigContext } from '../../Provider'
import DisabledContext from '../../Provider/DisabledContext'
import SizeContext from '../../Provider/SizeContext'
import { FormItemInputContext } from '../../Form/context'
import LocaleReceiver from '../../LocaleProvider/LocaleReceiver'
import type { InputStatus } from '../../utils/statusUtils'
import { getMergedStatus, getStatusClassNames } from '../../utils/statusUtils'
import enUS from '../locale/date_EN_US'
import { getPlaceholder, transPlacement2DropdownAlign } from '../util'
import type { CommonPickerMethods, DatePickRef, PickerComponentClass } from './interface'

import useStyle from '../styled'

export default function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  type DatePickerProps = PickerProps<DateType> & {
    status?: InputStatus
    hashId?: string
    popupClassName?: string
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName?: string
  }
  function getPicker<InnerPickerProps extends DatePickerProps>(
    picker?: PickerMode,
    displayName?: string,
  ) {
    const Picker = forwardRef<DatePickRef<DateType> | CommonPickerMethods, InnerPickerProps>(
      (props, ref) => {
        const {
          prefixCls: customizePrefixCls,
          getPopupContainer: customizeGetPopupContainer,
          className,
          size: customizeSize,
          bordered = true,
          placement,
          placeholder,
          popupClassName,
          disabled: customDisabled,
          status: customStatus,
          ...restProps
        } = props

        const { getPrefixCls, getPopupContainer } = useContext(ConfigContext)
        const prefixCls = getPrefixCls('picker', customizePrefixCls)
        const innerRef = React.useRef<BasicPicker<DateType>>(null)
        const { format, showTime } = props as any

        const [wrapSSR, hashId] = useStyle(prefixCls)

        useImperativeHandle(ref, () => ({
          focus: () => innerRef.current?.focus(),
          blur: () => innerRef.current?.blur(),
        }))

        const additionalProps = {
          showToday: true,
        }

        let additionalOverrideProps: any = {}
        if (picker) {
          additionalOverrideProps.picker = picker
        }
        const mergedPicker = picker || props.picker

        additionalOverrideProps = {
          ...additionalOverrideProps,
          ...(showTime ? getTimeProps({ format, picker: mergedPicker, ...showTime }) : {}),
          ...(mergedPicker === 'time'
            ? getTimeProps({ format, ...props, picker: mergedPicker })
            : {}),
        }
        const rootPrefixCls = getPrefixCls()
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
            {mergedPicker === 'time' ? <AccessTime /> : <CalendarToday />}
            {hasFeedback && feedbackIcon}
          </>
        )

        return wrapSSR(
          <LocaleReceiver componentName="DatePicker" defaultLocale={enUS}>
            {contextLocale => {
              const locale = { ...contextLocale, ...props.locale }

              return (
                <BasicPicker<DateType>
                  ref={innerRef}
                  placeholder={getPlaceholder(mergedPicker, locale, placeholder)}
                  suffixIcon={suffixNode}
                  dropdownAlign={transPlacement2DropdownAlign(placement)}
                  clearIcon={<CancelOutlined />}
                  prevIcon={<span className={`${prefixCls}-prev-icon`} />}
                  nextIcon={<span className={`${prefixCls}-next-icon`} />}
                  superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
                  superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
                  allowClear
                  transitionName={`${rootPrefixCls}-slide-up`}
                  {...additionalProps}
                  {...restProps}
                  {...additionalOverrideProps}
                  locale={locale!.lang}
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
                  prefixCls={prefixCls}
                  getPopupContainer={customizeGetPopupContainer || getPopupContainer}
                  generateConfig={generateConfig}
                  components={Components}
                  disabled={mergedDisabled}
                  dropdownClassName={classNames(hashId, popupClassName)}
                />
              )
            }}
          </LocaleReceiver>,
        )
      },
    )

    if (displayName) {
      Picker.displayName = displayName
    }

    return Picker as unknown as PickerComponentClass<InnerPickerProps>
  }

  const DatePicker = getPicker<DatePickerProps>()
  const WeekPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('week', 'WeekPicker')
  const MonthPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('month', 'MonthPicker')
  const YearPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('year', 'YearPicker')
  const TimePicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>('time', 'TimePicker')

  return { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker }
}
