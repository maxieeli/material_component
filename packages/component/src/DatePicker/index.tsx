import type { Dayjs } from 'dayjs'
import dayjsGenerateConfig from '@developerli/basic-picker/es/generate/dayjs'
import genPurePanel from '../utils/PurePanel'
import type {
  PickerDateProps,
  PickerProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker'
import generatePicker from './generatePicker'

export type DatePickerProps = PickerProps<Dayjs>
export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>
export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>
export type RangePickerProps = BaseRangePickerProps<Dayjs>

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)
const PurePanel = genPurePanel(DatePicker, 'picker');
(DatePicker as any)._InternalPanel = PurePanel

export default DatePicker as typeof DatePicker & {
  _InternalPanel: typeof PurePanel
}
