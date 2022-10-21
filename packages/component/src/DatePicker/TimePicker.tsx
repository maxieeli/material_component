import type { Dayjs } from 'dayjs'
import * as React from 'react'
import DatePicker from './index'
import type { PickerTimeProps, RangePickerTimeProps } from './generatePicker'
import genPurePanel from '../utils/PurePanel'
import type { InputStatus } from '../utils/statusUtils'

const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker

export interface TimePickerLocale {
  placeholder?: string
  rangePlaceholder?: [string, string]
}

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Dayjs>, 'picker'> {
  popupClassName?: string
}

const RangePicker = React.forwardRef<any, TimeRangePickerProps>((props, ref) => (
  <InternalRangePicker {...props} picker='time' mode={undefined} ref={ref} />
))

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
  addon?: () => React.ReactNode
  status?: InputStatus
  popupClassName?: string
}

const TimePicker = React.forwardRef<any, TimePickerProps>(
  ({ addon, renderExtraFooter, ...restProps }, ref) => {
    const internalRenderExtraFooter = React.useMemo(() => {
      if (renderExtraFooter) {
        return renderExtraFooter
      }
      if (addon) {
        return addon
      }
      return undefined
    }, [addon, renderExtraFooter])

    return (
      <InternalTimePicker
        {...restProps}
        mode={undefined}
        ref={ref}
        renderExtraFooter={internalRenderExtraFooter}
      />
    )
  },
)

TimePicker.displayName = 'TimePicker'

const PurePanel = genPurePanel(TimePicker, 'picker');
(TimePicker as MergedTimePicker)._InternalPanel = PurePanel

type MergedTimePicker = typeof TimePicker & {
  RangePicker: typeof RangePicker
  _InternalPanel: typeof PurePanel
}

(TimePicker as MergedTimePicker).RangePicker = RangePicker;
(TimePicker as MergedTimePicker)._InternalPanel = PurePanel

export default TimePicker as MergedTimePicker
