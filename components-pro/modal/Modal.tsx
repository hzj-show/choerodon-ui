import React, { cloneElement, isValidElement, Key, ReactNode } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import defer from 'lodash/defer';
import noop from 'lodash/noop';
import classNames from 'classnames';
import classes from 'component-classes';
import ViewComponent, { ViewComponentProps } from '../core/ViewComponent';
import Icon from '../icon';
import autobind from '../_util/autobind';
import Button from '../button/Button';
import EventManager from '../_util/EventManager';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import isEmpty from '../_util/isEmpty';
import { ButtonColor, FuncType } from '../button/enum';
import asyncComponent from '../_util/AsyncComponent';
import KeyCode from 'choerodon-ui/lib/_util/KeyCode';
import Message from '../message';
import exception from '../_util/exception';
import { $l } from '../locale-context';

export interface ModalProps extends ViewComponentProps {
  closable?: boolean;
  movable?: boolean;
  fullScreen?: boolean;
  maskClosable?: boolean;
  keyboardClosable?: boolean;
  header?: boolean;
  footer?: ReactNode | boolean;
  destroyOnClose?: boolean;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onClose?: () => Promise<boolean | undefined>;
  onOk?: () => Promise<boolean | undefined>;
  onCancel?: () => Promise<boolean | undefined>;
  afterClose?: () => void;
  close?: () => void;
  okCancel?: boolean;
  drawer?: boolean;
  key?: Key;
  type?: string;
}

export default class Modal extends ViewComponent<ModalProps> {
  static displayName = 'Modal';

  static propTypes = {
    closable: PropTypes.bool,
    movable: PropTypes.bool,
    fullScreen: PropTypes.bool,
    maskClosable: PropTypes.bool,
    keyboardClosable: PropTypes.bool,
    header: PropTypes.bool,
    footer: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    destroyOnClose: PropTypes.bool,
    okText: PropTypes.node,
    cancelText: PropTypes.node,
    onClose: PropTypes.func,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    afterClose: PropTypes.func,
    okCancel: PropTypes.bool,
    drawer: PropTypes.bool,
    type: PropTypes.string,
    ...ViewComponent.propTypes,
  };

  static defaultProps = {
    suffixCls: 'modal',
    header: true,
    closable: false,
    movable: true,
    maskClosable: false,
    keyboardClosable: true,
    okCancel: true,
    destroyOnClose: true,
    fullScreen: false,
    drawer: false,
    autoFocus: true,
  };

  static key;
  static open;
  static confirm;
  static info;
  static success;
  static error;
  static warning;

  moveEvent: EventManager = new EventManager(typeof window === 'undefined' ? void 0 : document);
  okCancelEvent: EventManager = new EventManager();

  offset?: [number | string | undefined, number | string | undefined];

  cancelButton: Button | null;

  saveCancelRef = node => this.cancelButton = node;

  handleKeyDown = (e) => {
    if (this.cancelButton && !this.cancelButton.isDisabled() && e.keyCode === KeyCode.ESC) {
      this.cancelButton.handleClickWait(e);
    }
  };

  getOtherProps() {
    const otherProps = omit(super.getOtherProps(), [
      'closable',
      'movable',
      'maskClosable',
      'keyboardClosable',
      'fullScreen',
      'title',
      'header',
      'footer',
      'close',
      'okText',
      'cancelText',
      'okCancel',
      'onClose',
      'onOk',
      'onCancel',
      'destroyOnClose',
      'drawer',
      'afterClose',
    ]);
    if (this.props.keyboardClosable) {
      otherProps.autoFocus = true;
      otherProps.tabIndex = -1;
      otherProps.onKeyDown = this.handleKeyDown;
    }

    return otherProps;
  }

  getClassName(): string | undefined {
    const { prefixCls, props: { style = {}, fullScreen, drawer } } = this;

    return super.getClassName({
      [`${prefixCls}-center`]: !drawer && !('left' in style || 'right' in style) && !this.offset,
      [`${prefixCls}-fullscreen`]: fullScreen,
      [`${prefixCls}-drawer`]: drawer,
    });
  }

  render() {
    const { prefixCls } = this;
    const header = this.getHeader();
    const body = this.getBody();
    const footer = this.getFooter();
    return (
      <div {...this.getMergedProps()}>
        <div className={`${prefixCls}-content`}>
          {header}
          {body}
          {footer}
        </div>
      </div>
    );
  }

  componentWillUpdate({ hidden }) {
    if (hidden === false && hidden !== this.props.hidden) {
      defer(() => this.focus());
    }
  }

  componentWillUnmount() {
    this.moveEvent.clear();
    this.okCancelEvent.clear();
  }

  @autobind
  handleHeaderMouseDown(downEvent: MouseEvent) {
    const { element } = this;
    if (element) {
      const { prefixCls } = this;
      const { clientX, clientY } = downEvent;
      const { offsetLeft, offsetTop } = element;
      this.moveEvent.addEventListener('mousemove', (moveEvent: MouseEvent) => {
        const { clientX: moveX, clientY: moveY } = moveEvent;
        classes(element).remove(`${prefixCls}-center`);
        const left = pxToRem(Math.max(offsetLeft + moveX - clientX, 0));
        const top = pxToRem(Math.max(offsetTop + moveY - clientY, 0));
        this.offset = [left, top];
        Object.assign(element.style, {
          left,
          top,
        });
      }).addEventListener('mouseup', () => {
        this.moveEvent.clear();
      });
    }
  }

  @autobind
  async handleOk() {
    const { onOk = noop } = this.props;
    const promise = Promise.all([onOk(), this.okCancelEvent.fireEvent('ok')]);
    try {
      const [ret1, ret2] = await promise;
      if (ret1 !== false && ret2) {
        this.close();
      }
    } catch (e) {
      Message.error(exception(e));
    }
  }

  @autobind
  async handleCancel() {
    const { onCancel = noop } = this.props;
    const promise = Promise.all([onCancel(), this.okCancelEvent.fireEvent('cancel')]);
    try {
      const [ret1, ret2] = await promise;
      if (ret1 !== false && ret2) {
        this.close();
      }
    } catch (e) {
      Message.error(exception(e));
    }
  }

  getTitle(): ReactNode {
    const { props: { title }, prefixCls } = this;
    if (title) {
      return (
        <div className={`${prefixCls}-title`}>
          {title}
        </div>
      );
    }
  }

  getHeader(): ReactNode {
    const { prefixCls, props: { closable, movable, fullScreen, drawer, header } } = this;
    if (!!header) {
      const title = this.getTitle();
      const buttons = this.getHeaderButtons();
      if (title || closable || movable) {
        const headerProps: any = {
          className: classNames(`${prefixCls}-header`, {
            [`${prefixCls}-movable`]: movable && !fullScreen && !drawer,
          }),
        };
        if (movable && !fullScreen && !drawer) {
          headerProps.onMouseDown = this.handleHeaderMouseDown;
        }
        return (
          <div {...headerProps}>
            {title}
            {buttons}
          </div>
        );
      }
    }
  }

  getHeaderButtons(): ReactNode {
    const { prefixCls } = this;
    const closeButton = this.getCloseButton();
    if (closeButton) {
      return (
        <div className={`${prefixCls}-header-buttons`}>
          {closeButton}
        </div>
      );
    }
  }

  getCloseButton(): ReactNode {
    const { prefixCls, props: { closable } } = this;
    if (closable) {
      return (
        <button className={`${prefixCls}-header-button`} onClick={this.close}>
          <Icon type="close" />
        </button>
      );
    }
  }

  renderChildren(children: ReactNode): ReactNode {
    if (children) {
      const { prefixCls, props: { close = noop } } = this;
      const { okCancelEvent } = this;
      const handleOk = (ok) => (
        okCancelEvent.removeEventListener('ok'), okCancelEvent.addEventListener('ok', ok)
      );
      const handleCancel = (cancel) => (
        okCancelEvent.removeEventListener('cancel'), okCancelEvent.addEventListener('cancel', cancel)
      );
      return (
        <div className={`${prefixCls}-body`}>
          {isValidElement(children) ? cloneElement(children, { modal: { close, handleOk, handleCancel } } as any) : children}
        </div>
      );
    }
  }

  getBody(): ReactNode {
    const { children } = this.props;
    return this.renderChildren(typeof children === 'function' ? asyncComponent(children) : children);
  }

  getFooter(): ReactNode {
    const { prefixCls, props: { footer = this.getDefaultFooter(), drawer, header } } = this;
    if (!isEmpty(footer, true)) {
      const className = classNames(`${prefixCls}-footer`, {
        [`${prefixCls}-footer-drawer`]: !!drawer,
        [`${prefixCls}-footer-without-border`]: !header,
      });
      return (
        <div className={className}>
          {header ? footer : this.getConfirmFooter()}
        </div>
      );
    }
  }

  getConfirmFooter() {
    const { okText = $l('Modal', 'ok'), cancelText = $l('Modal', 'cancel'), type } = this.props;
    const isConfirm = type === 'confirm';
    const cancelBtn = isConfirm ? (
      <Button ref={this.saveCancelRef} onClick={this.handleCancel}>{cancelText}</Button>
    ) : (
      <Button
        funcType={FuncType.flat}
        color={ButtonColor.blue}
        onClick={this.handleOk}
      >
        {okText}
      </Button>
    );
    return (
      <div>
        {isConfirm && <Button color={ButtonColor.blue} onClick={this.handleOk}>{okText}</Button>}
        {cancelBtn}
      </div>
    );
  }

  getDefaultFooter() {
    const { okCancel, okText = $l('Modal', 'ok'), cancelText = $l('Modal', 'cancel') } = this.props;
    return (
      <div>
        <Button color={ButtonColor.blue} onClick={this.handleOk}>{okText}</Button>
        {okCancel && <Button ref={this.saveCancelRef} onClick={this.handleCancel}>{cancelText}</Button>}
      </div>
    );
  }

  @autobind
  close() {
    const { close = noop } = this.props;
    close();
  }
}
