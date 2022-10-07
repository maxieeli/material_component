import * as React from 'react';
import memoizeOne from 'memoize-one';
import type { ValidateMessages } from 'rc-field-form/es/interface';
import type { PickerLocale as DatePickerLocale } from '../DatePicker/generatePicker';
import type { PaginationLocale } from '../Pagination/Pagination';
import type { PopconfirmLocale } from '../PopConfirm/PurePanel';
import type { TableLocale } from '../Table/interface';
import type { UploadLocale } from '../Upload/interface';
import LocaleContext from './context';

export interface Locale {
  locale: string;
  Pagination?: PaginationLocale;
  DatePicker?: DatePickerLocale;
  TimePicker?: Record<string, any>;
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

export interface LocaleProviderProps {
  locale: Locale;
  children?: React.ReactNode;
}

export default class LocaleProvider extends React.Component<LocaleProviderProps, any> {
  static defaultProps = {
    locale: {},
  };

  constructor(props: LocaleProviderProps) {
    super(props);
  }

  getMemoizedContextValue = memoizeOne((localeValue: Locale): Locale & { exist?: boolean } => ({
    ...localeValue,
    exist: true,
  }));

  render() {
    const { locale, children } = this.props;
    const contextValue = this.getMemoizedContextValue(locale);
    return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
  }
}
