import * as React from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import omit from 'rc-util/es/omit';
import { SvgIcon } from '@mui/material'
import { ConfigConsumer, ConfigContext } from '../Provider';
import { cloneElement, isValidElement } from '../utils/reactNode';
import { tuple } from '../utils/type';
import useStyle from './styled';

const LoadingSizes = tuple('small', 'default', 'large');
export type LoadingSize = typeof LoadingSizes[number];
export type LoadingIndicator = React.ReactElement<HTMLElement>;

export interface LoadingProps {
  prefixCls?: string;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  size?: LoadingSize;
  tip?: React.ReactNode;
  delay?: number;
  wrapperClassName?: string;
  icon?: LoadingIndicator;
  children?: React.ReactNode;
}

export interface LoadingClassProps extends LoadingProps {
  hashId: string;
  loadingPrefixCls: string;
}

export type LoadingFCType = React.FC<LoadingProps> & {
  setDefaultIndicator: (indicator: React.ReactNode) => void;
};

export interface LoadingState {
  loading?: boolean;
  notCssAnimationSupported?: boolean;
}

// Render indicator
let defaultIndicator: React.ReactNode = null;

function renderIndicator(prefixCls: string, props: LoadingClassProps): React.ReactNode {
  const { icon, style } = props;
  const middleClassName = `${prefixCls}-middle`;

  // should not be render default indicator when indicator value is null
  if (icon === null) {
    return null;
  }

  if (isValidElement(icon)) {
    return cloneElement(icon, {
      className: classNames(icon.props.className, middleClassName),
    });
  }

  if (isValidElement(defaultIndicator)) {
    return cloneElement(defaultIndicator as LoadingIndicator, {
      className: classNames((defaultIndicator as LoadingIndicator).props.className, middleClassName),
    });
  }

  return (
    <span className={classNames(middleClassName)}>
      <SvgIcon style={style} viewBox='0 0 1024 1024'>
        <path d='M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 6z' />
      </SvgIcon>
    </span>
  );
}

function shouldDelay(loading?: boolean, delay?: number): boolean {
  return !!loading && !!delay && !isNaN(Number(delay));
}

class Loading extends React.Component<LoadingClassProps, LoadingState> {
  static defaultProps = {
    loading: true,
    size: 'default' as LoadingSize,
    wrapperClassName: '',
  };

  originalUpdateLoading: () => void;

  constructor(props: LoadingClassProps) {
    super(props);

    const { loading, delay } = props;
    const shouldBeDelayed = shouldDelay(loading, delay);
    this.state = {
      loading: loading && !shouldBeDelayed,
    };
    this.originalUpdateLoading = this.updateLoading;
    this.debouncifyUpdateLoading(props);
  }

  componentDidMount() {
    this.updateLoading();
  }

  componentDidUpdate() {
    this.debouncifyUpdateLoading();
    this.updateLoading();
  }

  componentWillUnmount() {
    this.cancelExistingLoading();
  }

  debouncifyUpdateLoading = (props?: LoadingClassProps) => {
    const { delay } = props || this.props;
    if (delay) {
      this.cancelExistingLoading();
      this.updateLoading = debounce(this.originalUpdateLoading, delay);
    }
  };

  updateLoading = () => {
    const { loading } = this.props;
    const { loading: currentLoading } = this.state;
    if (currentLoading !== loading) {
      this.setState({ loading });
    }
  };

  cancelExistingLoading() {
    const { updateLoading } = this;
    if (updateLoading && (updateLoading as any).cancel) {
      (updateLoading as any).cancel();
    }
  }

  isNestedPattern() {
    return !!(this.props && typeof this.props.children !== 'undefined');
  }

  renderLoading = () => {
    const {
      loadingPrefixCls: prefixCls,
      hashId,
      className,
      size,
      tip,
      wrapperClassName,
      style,
      ...restProps
    } = this.props;
    const { loading } = this.state;

    const loadingClassName = classNames(
      prefixCls,
      {
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-show-text`]: !!tip,
      },
      className,
      hashId,
    );

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(restProps, ['loading', 'delay', 'icon', 'prefixCls']);

    const loadingElement = (
      <div
        {...divProps}
        style={style}
        className={loadingClassName}
        aria-live="polite"
        aria-busy={loading}
      >
        {renderIndicator(prefixCls, this.props)}
        {tip ? <div className={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    if (this.isNestedPattern()) {
      const containerClassName = classNames(`${prefixCls}-container`, {
        [`${prefixCls}-blur`]: loading,
      });
      return (
        <div
          {...divProps}
          className={classNames(`${prefixCls}-nested-loading`, wrapperClassName, hashId)}
        >
          {loading && <div key="loading">{loadingElement}</div>}
          <div className={containerClassName} key="container">
            {this.props.children}
          </div>
        </div>
      );
    }
    return loadingElement;
  };

  render() {
    return <ConfigConsumer>{this.renderLoading}</ConfigConsumer>;
  }
}

const LoadingFC: LoadingFCType = (props: LoadingProps) => {
  const { prefixCls: customizePrefixCls } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const loadingPrefixCls = getPrefixCls('loading', customizePrefixCls);

  const [wrapUI, hashId] = useStyle(loadingPrefixCls);

  const loadingClassProps: LoadingClassProps = {
    ...props,
    loadingPrefixCls,
    hashId,
  };
  return wrapUI(<Loading {...loadingClassProps} />);
};

LoadingFC.setDefaultIndicator = (indicator: React.ReactNode) => {
  defaultIndicator = indicator;
};

LoadingFC.displayName = 'Loading';

export default LoadingFC;
