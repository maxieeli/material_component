import type { GenerateConfig } from '@developerli/basic-picker/es/generate/index'
import type { Locale as RcPickerLocale, PickerMode } from '@developerli/basic-picker/es/interface'
import type { SharedTimeProps } from '@developerli/basic-picker/es/panels/TimePanel'
import type {
  PickerBaseProps as RCPickerBaseProps,
  PickerDateProps as RCPickerDateProps,
  PickerTimeProps as RCPickerTimeProps,
} from '@developerli/basic-picker/es/Picker'
import type {
  RangePickerBaseProps as RCRangePickerBaseProps,
  RangePickerDateProps as RCRangePickerDateProps,
  RangePickerTimeProps as RCRangePickerTimeProps,
} from '@developerli/basic-picker/es/RangePicker'
import type { SizeType } from '../../Provider/SizeContext'
import type { TimePickerLocale } from '../TimePicker'
import type { InputStatus } from '../../utils/statusUtils'
import { tuple } from '../../utils/type'
import PickerButton from '../PickerButton'
import PickerTag from '../PickerTag'
import generateRangePicker from './generateRangePicker'
import generateSinglePicker from './generateSinglePicker'

export const Components = { button: PickerButton, rangeItem: PickerTag }

function toArray<T>(list: T | T[]): T[] {
  if (!list) {
    return []
  }
  return Array.isArray(list) ? list : [list]
}

export function getTimeProps<DateType, DisabledTime>(
  props: { format?: string; picker?: PickerMode } & Omit<
    SharedTimeProps<DateType>,
    'disabledTime'
  > & {
      disabledTime?: DisabledTime
    },
) {
  const { format, picker, showHour, showMinute, showSecond, use12Hours } = props

  const firstFormat = toArray(format)[0]
  const showTimeObj = { ...props }

  if (firstFormat && typeof firstFormat === 'string') {
    if (!firstFormat.includes('s') && showSecond === undefined) {
      showTimeObj.showSecond = false
    }
    if (!firstFormat.includes('m') && showMinute === undefined) {
      showTimeObj.showMinute = false
    }
    if (!firstFormat.includes('H') && !firstFormat.includes('h') && showHour === undefined) {
      showTimeObj.showHour = false
    }

    if ((firstFormat.includes('a') || firstFormat.includes('A')) && use12Hours === undefined) {
      showTimeObj.use12Hours = true
    }
  }

  if (picker === 'time') {
    return showTimeObj
  }

  if (typeof firstFormat === 'function') {
    delete showTimeObj.format
  }

  return {
    showTime: showTimeObj,
  }
}
const DataPickerPlacements = tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight')
type DataPickerPlacement = typeof DataPickerPlacements[number]

type InjectDefaultProps<Props> = Omit<
  Props,
  'locale' | 'generateConfig' | 'hideHeader' | 'components'
> & {
  locale?: PickerLocale
  size?: SizeType
  placement?: DataPickerPlacement
  bordered?: boolean
  status?: InputStatus
}

export type PickerLocale = {
  lang: RcPickerLocale & AdditionalPickerLocaleLangProps
  timePickerLocale: TimePickerLocale
} & AdditionalPickerLocaleProps

export type AdditionalPickerLocaleProps = {
  dateFormat?: string
  dateTimeFormat?: string
  weekFormat?: string
  monthFormat?: string
}

export type AdditionalPickerLocaleLangProps = {
  placeholder: string
  yearPlaceholder?: string
  quarterPlaceholder?: string
  monthPlaceholder?: string
  weekPlaceholder?: string
  rangeYearPlaceholder?: [string, string]
  rangeQuarterPlaceholder?: [string, string]
  rangeMonthPlaceholder?: [string, string]
  rangeWeekPlaceholder?: [string, string]
  rangePlaceholder?: [string, string]
}

// Picker Props
export type PickerBaseProps<DateType> = InjectDefaultProps<RCPickerBaseProps<DateType>>
export type PickerDateProps<DateType> = InjectDefaultProps<RCPickerDateProps<DateType>>
export type PickerTimeProps<DateType> = InjectDefaultProps<RCPickerTimeProps<DateType>>

export type PickerProps<DateType> =
  | PickerBaseProps<DateType>
  | PickerDateProps<DateType>
  | PickerTimeProps<DateType>

// Range Picker Props
export type RangePickerBaseProps<DateType> = InjectDefaultProps<RCRangePickerBaseProps<DateType>>
export type RangePickerDateProps<DateType> = InjectDefaultProps<RCRangePickerDateProps<DateType>>
export type RangePickerTimeProps<DateType> = InjectDefaultProps<RCRangePickerTimeProps<DateType>>

export type RangePickerProps<DateType> =
  | RangePickerBaseProps<DateType>
  | RangePickerDateProps<DateType>
  | RangePickerTimeProps<DateType>

function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  // =========================== Picker ===========================
  const {
    DatePicker, WeekPicker,
    MonthPicker, YearPicker,
    TimePicker
  } = generateSinglePicker(generateConfig)

  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker(generateConfig)

  // =========================== Export ===========================
  type MergedDatePickerType = typeof DatePicker & {
    WeekPicker: typeof WeekPicker
    MonthPicker: typeof MonthPicker
    YearPicker: typeof YearPicker
    RangePicker: typeof RangePicker
    TimePicker: typeof TimePicker
  }

  const MergedDatePicker = DatePicker as MergedDatePickerType
  MergedDatePicker.WeekPicker = WeekPicker
  MergedDatePicker.MonthPicker = MonthPicker
  MergedDatePicker.YearPicker = YearPicker
  MergedDatePicker.RangePicker = RangePicker
  MergedDatePicker.TimePicker = TimePicker

  return MergedDatePicker
}

export default generatePicker
