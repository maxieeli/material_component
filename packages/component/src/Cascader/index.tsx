import * as React from 'react';
import { useContext } from 'react';
import { ArrowRightOutlined } from '@mui/icons-material'
import classNames from 'classnames';
import type {
  BaseOptionType,
  DefaultOptionType,
  FieldNames,
  MultipleCascaderProps as BasicMultipleCascaderProps,
  ShowSearchType,
  SingleCascaderProps as BasicSingleCascaderProps,
} from '@developerli/basic-cascader';
import BasicCascader from '@developerli/basic-cascader';
import omit from 'rc-util/lib/omit';
import Loading from '../Loading'
import { ConfigContext } from '../Provider';
import defaultRenderEmpty from '../Provider/renderEmpty';
import DisabledContext from '../Provider/DisabledContext';
import type { SizeType } from '../Provider/SizeContext';
import SizeContext from '../Provider/SizeContext';
import { FormItemInputContext } from '../Form/context';
import getIcons from '../Select/utils/iconUtil';
import type { SelectCommonPlacement } from '../utils/motion';
import { getTransitionDirection, getTransitionName } from '../utils/motion';
import type { InputStatus } from '../utils/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../utils/statusUtils';
import useSelectStyle from '../Select/styled';
import useStyle from './styled';
import genPurePanel from '../utils/PurePanel';

export { BaseOptionType, DefaultOptionType };

export type FieldNamesType = FieldNames;

export type FilledFieldNamesType = Required<FieldNamesType>;

const { SHOW_CHILD, SHOW_PARENT } = BasicCascader;

function highlightKeyword(str: string, lowerKeyword: string, prefixCls: string | undefined) {
  const cells = str
    .toLowerCase()
    .split(lowerKeyword)
    .reduce((list, cur, index) => (index === 0 ? [cur] : [...list, lowerKeyword, cur]), []);
  const fillCells: React.ReactNode[] = [];
  let start = 0;

  cells.forEach((cell, index) => {
    const end = start + cell.length;
    let originWorld: React.ReactNode = str.slice(start, end);
    start = end;

    if (index % 2 === 1) {
      originWorld = (
        // eslint-disable-next-line react/no-array-index-key
        <span className={`${prefixCls}-menu-item-keyword`} key={`seperator-${index}`}>
          {originWorld}
        </span>
      );
    }

    fillCells.push(originWorld);
  });

  return fillCells;
}

const defaultSearchRender: ShowSearchType['render'] = (inputValue, path, prefixCls, fieldNames) => {
  const optionList: React.ReactNode[] = [];

  // We do lower here to save perf
  const lower = inputValue.toLowerCase();

  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ');
    }

    let label = (node as any)[fieldNames.label!];
    const type = typeof label;
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower, prefixCls);
    }

    optionList.push(label);
  });
  return optionList;
};

type SingleCascaderProps = Omit<BasicSingleCascaderProps, 'checkable' | 'options'> & {
  multiple?: false;
};
type MultipleCascaderProps = Omit<BasicMultipleCascaderProps, 'checkable' | 'options'> & {
  multiple: true;
};

type UnionCascaderProps = SingleCascaderProps | MultipleCascaderProps;

export type CascaderProps<DataNodeType> = UnionCascaderProps & {
  multiple?: boolean;
  size?: SizeType;
  disabled?: boolean;
  bordered?: boolean;
  placement?: SelectCommonPlacement;
  suffixIcon?: React.ReactNode;
  options?: DataNodeType[];
  status?: InputStatus;

  popupClassName?: string;
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName?: string;
};

export interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

const Cascader = React.forwardRef((props: CascaderProps<any>, ref: React.Ref<CascaderRef>) => {
  const {
    prefixCls: customizePrefixCls,
    size: customizeSize,
    disabled: customDisabled,
    className,
    multiple,
    bordered = true,
    transitionName,
    choiceTransitionName = '',
    popupClassName,
    dropdownClassName,
    expandIcon,
    placement,
    showSearch,
    allowClear = true,
    notFoundContent,
    direction,
    getPopupContainer,
    status: customStatus,
    showArrow,
    ...rest
  } = props;

  const restProps = omit(rest, ['suffixIcon' as any]);

  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
  } = useContext(ConfigContext);

  // =================== Form =====================
  const {
    status: contextStatus,
    hasFeedback,
    isFormItemInput,
    feedbackIcon,
  } = useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // =================== No Found ====================
  const mergedNotFoundContent = notFoundContent || (renderEmpty || defaultRenderEmpty)('Cascader');

  // ==================== Prefix =====================
  const rootPrefixCls = getPrefixCls();
  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const cascaderPrefixCls = getPrefixCls('cascader', customizePrefixCls);

  const [wrapSelectSSR, hashId] = useSelectStyle(prefixCls);
  const [wrapCascaderSSR] = useStyle(cascaderPrefixCls);

  // =================== Dropdown ====================
  const mergedDropdownClassName = classNames(
    popupClassName || dropdownClassName,
    `${cascaderPrefixCls}-dropdown`,
    hashId,
  );

  // ==================== Search =====================
  const mergedShowSearch = React.useMemo(() => {
    if (!showSearch) {
      return showSearch;
    }

    let searchConfig: ShowSearchType = {
      render: defaultSearchRender,
    };

    if (typeof showSearch === 'object') {
      searchConfig = {
        ...searchConfig,
        ...showSearch,
      };
    }

    return searchConfig;
  }, [showSearch]);

  // ===================== Size ======================
  const size = React.useContext(SizeContext);
  const mergedSize = customizeSize || size;

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Icon ======================
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ArrowRightOutlined />
  }

  const loadingIcon = (
    <span className={`${prefixCls}-menu-item-loading-icon`}>
      <Loading loading />
    </span>
  );

  // =================== Multiple ====================
  const checkable = React.useMemo(
    () => (multiple ? <span className={`${cascaderPrefixCls}-checkbox-inner`} /> : false),
    [multiple],
  );

  // ===================== Icons =====================
  const mergedShowArrow = showArrow !== undefined ? showArrow : props.loading || !multiple;
  const { suffixIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    hasFeedback,
    feedbackIcon,
    showArrow: mergedShowArrow,
    multiple,
    prefixCls,
  });

  // ===================== Placement =====================
  const getPlacement = () => {
    if (placement !== undefined) {
      return placement;
    }
    return direction === ('bottomLeft' as SelectCommonPlacement);
  };

  // ==================== Render =====================
  const renderNode = (
    <BasicCascader
      prefixCls={prefixCls}
      className={classNames(
        !customizePrefixCls && cascaderPrefixCls,
        {
          [`${prefixCls}-lg`]: mergedSize === 'large',
          [`${prefixCls}-sm`]: mergedSize === 'small',
          [`${prefixCls}-borderless`]: !bordered,
          [`${prefixCls}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(prefixCls, mergedStatus, hasFeedback),
        className,
        hashId,
      )}
      disabled={mergedDisabled}
      {...(restProps as any)}
      placement={getPlacement()}
      notFoundContent={mergedNotFoundContent}
      allowClear={allowClear}
      showSearch={mergedShowSearch}
      expandIcon={mergedExpandIcon}
      inputIcon={suffixIcon}
      removeIcon={removeIcon}
      clearIcon={clearIcon}
      loadingIcon={loadingIcon}
      checkable={checkable}
      dropdownClassName={mergedDropdownClassName}
      dropdownPrefixCls={customizePrefixCls || cascaderPrefixCls}
      choiceTransitionName={getTransitionName(rootPrefixCls, '', choiceTransitionName)}
      transitionName={getTransitionName(
        rootPrefixCls,
        getTransitionDirection(placement),
        transitionName,
      )}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
      ref={ref}
      showArrow={hasFeedback || showArrow}
    />
  );

  return wrapCascaderSSR(wrapSelectSSR(renderNode));
}) as unknown as (<OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  props: React.PropsWithChildren<CascaderProps<OptionType>> & { ref?: React.Ref<CascaderRef> },
) => React.ReactElement) & {
  displayName: string;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

Cascader.displayName = 'Cascader';

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Cascader);

Cascader.SHOW_PARENT = SHOW_PARENT;
Cascader.SHOW_CHILD = SHOW_CHILD;
Cascader._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export default Cascader;
