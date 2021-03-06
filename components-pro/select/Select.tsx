import React, { CSSProperties, Key, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import { observer } from 'mobx-react';
import { computed, IReactionDisposer, reaction, runInAction } from 'mobx';
import Menu, { Item, ItemGroup } from 'choerodon-ui/lib/rc-components/menu';
import TriggerField, { TriggerFieldProps } from '../trigger-field/TriggerField';
import autobind from '../_util/autobind';
import KeyCode from 'choerodon-ui/lib/_util/KeyCode';
import { pxToRem } from 'choerodon-ui/lib/_util/UnitConvertor';
import { ValidationMessages } from '../validator/Validator';
import Option from '../option/Option';
import OptGroup from '../option/OptGroup';
import { DataSetStatus, FieldType } from '../data-set/enum';
import DataSet from '../data-set/DataSet';
import Record from '../data-set/Record';
import { isSame, isSameLike } from '../data-set/utils';
import lookupStore from '../stores/LookupCodeStore';
import Spin from '../spin';
import { stopEvent } from '../_util/EventManager';
import normalizeOptions from '../option/normalizeOptions';
import { $l } from '../locale-context';
import getReactNodeText from '../_util/getReactNodeText';
import * as ObjectChainValue from '../_util/ObjectChainValue';

function updateActiveKey(menu: Menu, activeKey: string) {
  const store = menu.getStore();
  const menuId = menu.getEventKey();
  const state = store.getState();
  store.setState({
    activeKey: {
      ...state.activeKey,
      [menuId]: activeKey,
    },
  });
}

function getItemKey(record: Record, text: ReactNode, value: any) {
  return `item-${value || record.id}-${getReactNodeText(text) || record.id}`;
}

function getSimpleValue(value, valueField) {
  if (isPlainObject(value)) {
    return ObjectChainValue.get(value, valueField);
  }
  return value;
}

export interface SelectProps extends TriggerFieldProps {
  /**
   * 复合输入值
   * @default false
   */
  combo?: boolean;
  /**
   * 可搜索
   * @default false
   */
  searchable?: boolean;
  /**
   * 选项过滤
   * @param {Record} record
   * @return {boolean}
   */
  optionsFilter?: (record: Record, index: number, records: Record[]) => boolean;
  /**
   * 当选项改变时，检查并清除不在选项中的值
   * @default true
   */
  checkValueOnOptionsChange?: boolean;
  /**
   * 下拉框匹配输入框宽度
   * @default true
   */
  dropdownMatchSelectWidth?: boolean;
  /**
   * 下拉框菜单样式名
   */
  dropdownMenuStyle?: CSSProperties;
}

export class Select<T extends SelectProps> extends TriggerField<T & SelectProps> {
  static displayName = 'Select';

  static propTypes = {
    /**
     * 复合输入值
     * @default false
     */
    combo: PropTypes.bool,
    /**
     * 过滤器
     * @default false
     */
    searchable: PropTypes.bool,
    ...TriggerField.propTypes,
  };

  static defaultProps = {
    ...TriggerField.defaultProps,
    suffixCls: 'select',
    combo: false,
    searchable: false,
    dropdownMatchSelectWidth: true,
    checkValueOnOptionsChange: true,
  };

  static Option = Option;

  static OptGroup = OptGroup;

  comboOptions: DataSet = new DataSet();

  menu?: Menu | null;

  @computed
  get defaultValidationMessages(): ValidationMessages | null {
    return {
      valueMissing: $l('Select', 'value_missing'),
    };
  }

  @computed
  get textField(): string {
    return this.getProp('textField') || 'meaning';
  }

  @computed
  get valueField(): string {
    return this.getProp('valueField') || 'value';
  }

  get currentComboOption(): Record | undefined {
    return this.comboOptions.filter(record => !this.isSelected(record))[0];
  }

  @computed
  get filteredOptions(): Record[] {
    const { cascadeOptions, text, searchable, props: { optionsFilter } } = this;
    const data = optionsFilter ? cascadeOptions.filter(optionsFilter!) : cascadeOptions;
    if (searchable && text) {
      return data.filter(record => record.get(this.textField).indexOf(text) !== -1);
    }
    return data;
  }

  @computed
  get cascadeOptions(): Record[] {
    const { record, field, options, comboOptions } = this;
    const data = [...comboOptions.data, ...options.data];
    if (field) {
      const cascadeMap = field.get('cascadeMap');
      if (cascadeMap) {
        if (record) {
          const cascades = Object.keys(cascadeMap);
          return data.filter(item => cascades.every(cascade => isSameLike(record.get(cascadeMap[cascade]), item.get(cascade))));
        } else {
          return [];
        }
      }
    }
    return data;
  }

  @computed
  get editable(): boolean {
    const { combo } = this.props;
    return !this.isReadOnly() && (!!this.searchable || !!combo);
  }

  @computed
  get searchable(): boolean {
    return !!this.props.searchable;
  }

  @computed
  get multiple(): boolean {
    return !!this.getProp('multiple');
  }

  @computed
  get menuMultiple(): boolean {
    return this.multiple;
  }

  @computed
  get options(): DataSet {
    const { field, textField, valueField, multiple, props: { children } } = this;
    return normalizeOptions({ field, textField, valueField, multiple, children });
  }

  checkReaction?: IReactionDisposer;

  constructor(props, context) {
    super(props, context);
    this.checkValue(props.checkValueOnOptionsChange!);
  }

  saveMenu = node => this.menu = node;

  checkValue(check: boolean) {
    this.clearReaction();
    if (check) {
      this.checkReaction = reaction(() => this.cascadeOptions, () => this.processSelectedData());
    }
  }

  clearReaction() {
    if (this.checkReaction) {
      this.checkReaction();
      delete this.checkReaction;
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.clearReaction();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);
    this.checkValue(nextProps.checkValueOnOptionsChange!);
    this.checkComboOptions(nextProps);
  }

  componentDidUpdate() {
    this.forcePopupAlign();
  }

  getOtherProps() {
    const otherProps = omit(super.getOtherProps(), [
      'searchable',
      'combo',
      'multiple',
      'value',
      'name',
      'optionsFilter',
      'dropdownMatchSelectWidth',
      'dropdownMenuStyle',
      'checkValueOnOptionsChange',
    ]);
    return otherProps;
  }

  renderMultipleHolder() {
    const { name, multiple } = this;
    if (multiple) {
      return (
        <input key="value" className={`${this.prefixCls}-multiple-value`} value={this.toValueString(this.getValue()) || ''} name={name} />
      );
    } else {
      return (
        <input key="value" type="hidden" value={this.toValueString(this.getValue()) || ''} name={name} />
      );
    }
  }

  getMenu(): ReactNode {
    const { options, textField, valueField, filteredOptions, prefixCls, props: { dropdownMenuStyle } } = this;
    if (!options) {
      return null;
    }
    const groups = options.getGroups();
    const optGroups: ReactElement<any>[] = [];
    const selectedKeys: Key[] = [];
    (filteredOptions ? filteredOptions : options.data).forEach((record) => {
      let previousGroup: ReactElement<any> | undefined;
      groups.every((field) => {
        const label = record.get(field);
        if (label !== void 0) {
          if (!previousGroup) {
            previousGroup = optGroups.find(item => item.props.title === label);
            if (!previousGroup) {
              previousGroup = <ItemGroup key={`group-${label}`} title={label} children={[]} />;
              optGroups.push(previousGroup);
            }
          } else {
            const { children } = previousGroup.props;
            previousGroup = children.find(item => item.props.title === label);
            if (!previousGroup) {
              previousGroup = <ItemGroup key={`group-${label}`} title={label} children={[]} />;
              children.push(previousGroup);
            }
          }
          return true;
        }
        return false;
      });
      const value = record.get(valueField);
      const text = record.get(textField);
      const key: Key = getItemKey(record, text, value);
      if (this.isSelected(record)) {
        selectedKeys.push(key);
      }
      const option = (
        <Item
          key={key}
          value={record}
        >
          {text}
        </Item>
      );
      if (previousGroup) {
        const { children } = previousGroup.props;
        children.push(option);
      } else {
        optGroups.push(option);
      }
    });
    return (
      <Menu
        ref={this.saveMenu}
        defaultActiveFirst
        multiple={this.menuMultiple}
        selectedKeys={selectedKeys}
        prefixCls={`${prefixCls}-dropdown-menu`}
        onClick={this.handleMenuClick}
        style={dropdownMenuStyle}
      >
        {optGroups}
      </Menu>
    );
  }

  getPopupProps() {
    const { options, textField, valueField } = this;
    return {
      dataSet: options,
      textField,
      valueField,
    };
  }

  getPopupContent() {
    const { options } = this;
    const data = this.filteredOptions;
    return data.length ? (
      <Spin spinning={options.status === DataSetStatus.loading}>
        {this.getMenu()}
      </Spin>
    ) : null;
  }

  @autobind
  getPopupStyleFromAlign(target): CSSProperties | undefined {
    if (target && this.props.dropdownMatchSelectWidth) {
      return {
        minWidth: pxToRem(target.getBoundingClientRect().width),
      };
    }
  }

  getTriggerIconFont() {
    return 'baseline-arrow_drop_down';
  }

  @autobind
  handleKeyDown(e) {
    e.persist();
    const { menu } = this;
    if (!this.isDisabled() && !this.isReadOnly() && menu) {
      if (this.popup && menu.onKeyDown(e)) {
        stopEvent(e);
      } else {
        let direction = -1;
        switch (e.keyCode) {
          case KeyCode.RIGHT:
          case KeyCode.DOWN:
            direction = 1;
          case KeyCode.LEFT:
          case KeyCode.UP:
            this.handleKeyDownPrevNext(e, menu, direction);
            break;
          case KeyCode.END:
          case KeyCode.PAGE_DOWN:
            direction = 1;
          case KeyCode.HOME:
          case KeyCode.PAGE_UP:
            this.handleKeyDownFirstLast(e, menu, direction);
            break;
          case KeyCode.ENTER:
            this.handleKeyDownEnter(e);
            break;
          case KeyCode.ESC:
            this.handleKeyDownEsc(e);
            break;
          case KeyCode.SPACE:
            this.handleKeyDownSpace(e);
            break;
          default:
        }
      }
    }
    super.handleKeyDown(e);
  }

  handleKeyDownFirstLast(e, menu: Menu, direction: number) {
    stopEvent(e);
    const children = menu.getFlatInstanceArray();
    const activeItem = children[direction < 0 ? 0 : children.length - 1];
    if (activeItem) {
      if (!this.editable || this.popup) {
        updateActiveKey(menu, activeItem.props.eventKey);
      }
      if (!this.editable && !this.popup) {
        this.choose(activeItem.props.value);
      }
    }
  }

  handleKeyDownPrevNext(e, menu: Menu, direction: number) {
    if (!this.multiple && !this.editable) {
      const activeItem = menu.step(direction);
      if (activeItem) {
        updateActiveKey(menu, activeItem.props.eventKey);
        this.choose(activeItem.props.value);
      }
      e.preventDefault();
    } else if (e === KeyCode.DOWN) {
      this.expand();
      e.preventDefault();
    }
  }

  handleKeyDownEnter(_e) {
  }

  handleKeyDownEsc(e) {
    if (this.popup) {
      e.preventDefault();
      this.collapse();
    }
  }

  handleKeyDownSpace(e) {
    if (!this.editable) {
      e.preventDefault();
      if (!this.popup) {
        this.expand();
      }
    }
  }

  @autobind
  handleBlur(e) {
    if (!e.isDefaultPrevented()) {
      if (!this.popup || !this.filteredOptions.length) {
        this.resetFilter();
      }
      super.handleBlur(e);
    }
  }

  expand() {
    const { filteredOptions } = this;
    if (filteredOptions && filteredOptions.length) {
      super.expand();
    }
  }

  syncValueOnBlur(value) {
    if (value) {
      this.options.ready().then(() => {
        const record = this.findByText(value);
        if (record) {
          this.choose(record);
        }
      });
    }
  }

  findByText(text): Record | undefined {
    const { textField } = this;
    return this.cascadeOptions.find(record => isSameLike(record.get(textField), text));
  }

  findByValue(value): Record | undefined {
    const { valueField } = this;
    const autoType = this.getProp('type') === FieldType.auto;
    value = getSimpleValue(value, valueField);
    return this.cascadeOptions.find(record =>
      autoType ? isSameLike(record.get(valueField), value) : isSame(record.get(valueField), value),
    );
  }

  isSelected(record: Record) {
    const { valueField } = this;
    const autoType = this.getProp('type') === FieldType.auto;
    return this.getValues().some((value) => (
      value = getSimpleValue(value, valueField),
        autoType ? isSameLike(record.get(valueField), value) : isSame(record.get(valueField), value)
    ));
  }

  generateComboOption(value: string, callback: (text: string) => void): void {
    const { currentComboOption, textField, valueField, options } = this;
    if (value) {
      let found = this.findByText(value) || this.findByValue(value);
      if (found) {
        const text = found.get(textField);
        if (text !== value) {
          callback(text);
        }
        this.removeComboOption();
      } else if (currentComboOption) {
        currentComboOption.set(textField, value);
        currentComboOption.set(valueField, value);
        found = currentComboOption;
      } else {
        found = this.createComboOption(value);
      }
      options.current = found;
    } else {
      this.removeComboOption();
    }
  }

  createComboOption(value): Record {
    const { textField, valueField, menu } = this;
    const found = this.comboOptions.create({
      [textField]: value,
      [valueField]: value,
    }, 0);
    if (menu) {
      updateActiveKey(menu, getItemKey(found, value, value));
    }
    return found;
  }

  checkComboOptions(nextProps) {
    if (('value' in nextProps && !isSameLike(nextProps.value, this.value))) {
      this.setValue(nextProps.value);
      this.removeComboOptions();
    }
    if (!nextProps.combo && this.props.combo) {
      this.removeComboOptions();
    }
  }

  removeComboOptions() {
    this.comboOptions.forEach(record => this.removeComboOption(record));
  }

  removeComboOption(record?: Record): void {
    if (!record) {
      record = this.currentComboOption;
    }
    if (record && !this.isSelected(record)) {
      this.comboOptions.remove(record);
    }
  }

  handlePopupAnimateAppear() {
  }

  @autobind
  handlePopupAnimateEnd(key, exists) {
    if (!exists && key === 'align' && !this.isFocused) {
      this.resetFilter();
    }
  }

  @autobind
  handleMenuClick({ item: { props: { value } } }) {
    if (this.isSelected(value) && this.multiple) {
      this.unChoose(value);
    } else {
      this.choose(value);
    }
  }

  handleOptionSelect(record) {
    const newValue = record.get(this.valueField);
    this.addValue(newValue);
  }

  handleOptionUnSelect(record) {
    const { valueField } = this;
    const newValue = record.get(valueField);
    const autoType = this.getProp('type') === FieldType.auto;
    this.setValue(this.getValues().filter(v => (
      v = getSimpleValue(v, valueField),
        autoType ? !isSameLike(v, newValue) : !isSame(v, newValue)
    )));
    this.removeComboOption(record);
  }

  @autobind
  handleChange(e) {
    const { value } = e.target;
    this.setText(value);
    if (this.props.combo) {
      this.generateComboOption(value, (text) => this.setText(text));
    }
    if (!this.popup) {
      this.expand();
    }
  }

  processObjectValue(value, textField) {
    if (isPlainObject(value)) {
      return ObjectChainValue.get(value, textField);
    } else {
      const found = this.findByValue(value);
      if (found) {
        return found.get(textField);
      }
    }
  }

  processValue(value) {
    const { field, textField, valueField } = this;
    if (field) {
      const lookupKey = lookupStore.getKey(field);
      if (lookupKey) {
        return super.processValue(lookupStore.getText(lookupKey, value, valueField, textField));
      }
    }
    return super.processValue(this.processObjectValue(value, textField));
  }

  clear() {
    this.setText(void 0);
    this.setValue(null);
    this.removeComboOptions();
  }

  resetFilter() {
    this.setText(void 0);
    this.removeComboOption();
    this.forcePopupAlign();
  }

  @autobind
  reset() {
    super.reset();
    this.resetFilter();
  }

  unChoose(record?: Record | null) {
    if (!this.multiple) {
      this.collapse();
    }
    if (record) {
      this.handleOptionUnSelect(record);
    }
  }

  choose(record?: Record | null) {
    if (!this.multiple) {
      this.collapse();
    }
    if (record) {
      this.handleOptionSelect(record);
    }
  }

  @autobind
  async handlePopupHiddenChange(hidden: boolean) {
    if (!hidden) {
      this.forcePopupAlign();
    }
    super.handlePopupHiddenChange(hidden);
  }

  async processSelectedData() {
    this.comboOptions.remove(this.comboOptions.data);
    const values = this.getValues();
    const { field } = this;
    if (field) {
      await field.ready();
    }
    const { filteredOptions, props: { combo } } = this;
    runInAction(() => {
      const newValues = values.filter(value => {
        const record = this.findByValue(value);
        if (record) {
          return true;
        } else if (combo) {
          this.createComboOption(value);
          return true;
        }
        return false;
      });
      if (filteredOptions.length && !isEqual(newValues, values)) {
        this.setValue(this.multiple ? newValues : newValues[0]);
      }
    });
  };
}

@observer
export default class ObserverSelect<T extends SelectProps> extends Select<T & SelectProps> {
  static defaultProps = Select.defaultProps;
}
