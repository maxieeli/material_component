import type { ValidateMessages } from 'rc-field-form/es/interface';
import type { PickerLocale as DatePickerLocale } from '../DatePicker/generatePicker';
import type { PaginationLocale } from '../Pagination/Pagination';
import type { PopconfirmLocale } from '../PopConfirm/PurePanel';
import type { TableLocale } from '../Table/interface';
import type { UploadLocale } from '../Upload/interface';

export interface Locale {
  locale: string;
  Pagination?: PaginationLocale;
  DatePicker?: DatePickerLocale;
  TimePicker?: Record<string, any>;
  Calendar?: Record<string, any>;
  Table?: TableLocale;
  Popconfirm?: PopconfirmLocale;
  Select?: Record<string, any>;
  Upload?: UploadLocale;
  global?: Record<string, any>;
  Text?: {
    edit?: any;
    copy?: any;
    copied?: any;
    expand?: any;
  };
  Form?: {
    optional?: string;
    defaultValidateMessages: ValidateMessages;
  };
}