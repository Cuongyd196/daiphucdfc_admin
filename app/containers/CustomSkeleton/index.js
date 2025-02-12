import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, DatePicker, Form, Input, Select, Skeleton } from 'antd';
import { CONSTANTS } from '@constants';

class CustomSkeleton extends Component {

  renderDatePicker() {
    return <DatePicker style={{ width: '100%' }}
                       format="DD-MM-YYYY"
                       placeholder={this.props.placeholder || this.props.label}
                       disabled={this.props.disabled}/>;
  }

  renderInput() {
    return <Input placeholder={this.props.placeholder || this.props.label}
                  prefix={this.props.prefix}
                  suffix={this.props.suffix}
                  disabled={this.props.disabled}/>;
  }

  renderPassword() {
    return <Input.Password placeholder={this.props.placeholder || this.props.label}
                           prefix={this.props.prefix}
                           suffix={this.props.suffix}
                           disabled={this.props.disabled}/>;
  }

  renderOption() {
    const { label, options, placeholder } = this.props;
    return <Select placeholder={placeholder || `Chọn ${label}`}
                   disabled={this.props.disabled} dropdownClassName='small'
                   showSearch={this.props.showSearch}
                   mode={this.props.mode}
                   filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
      {options.data.map(item => {
        return <Select.Option
          key={item.value || item[options.valueString]}
          value={item.value || item[options.valueString]}>
          {item.label || item[options.labelString]}
        </Select.Option>;
      })}
    </Select>;
  }

  renderArea() {
    const { size } = this.props;

    return <Input.TextArea
      placeholder={this.props.placeholder || this.props.label}
      disabled={this.props.disabled}
      autoSize={size || { minRows: 5, maxRows: 5 }}/>;
  }

  render() {
    const { type, isShowSkeleton, rules, layoutCol, labelStrong } = this.props;

    const label = labelStrong
      ? <strong>{this.props.label}</strong>
      : this.props.label;

    if (isShowSkeleton)
      return <Col {...layoutCol} className={this.props.className}>
        <Form.Item label={label}
                   rules={rules} {...this.props.layoutItem}
                   className={this.props.itemClassName || ''} colon={this.props.colon}>
          <Skeleton.Input active size='small'/>
        </Form.Item>
      </Col>;

    return <Col {...layoutCol} className={this.props.className}>
      <Form.Item label={label} {...this.props.layoutItem} name={this.props.name} hasFeedback
                 className={this.props.itemClassName || ''}
                 style={this.props.itemStyle || {}}
                 colon={this.props.colon}
                 rules={this.props.rules}
                 dependencies={this.props.dependencies}
                 validateTrigger={Array.isArray(rules) && rules.length ? ['onChange', 'onBlur'] : false}>
        {type === CONSTANTS.INPUT
          ? this.renderInput()
          : type === CONSTANTS.DATE
            ? this.renderDatePicker()
            : type === CONSTANTS.SELECT
              ? this.renderOption()
              : type === CONSTANTS.TEXT_AREA
                ? this.renderArea()
                : type === CONSTANTS.PASSWORD
                  ? this.renderPassword()
                  : this.props.children}

      </Form.Item>
    </Col>;

  }
}

CustomSkeleton.propTypes = {
  labelStrong: PropTypes.bool,
  colon: PropTypes.bool,
  hidden: PropTypes.bool,
  layoutCol: PropTypes.object,
  itemStyle: PropTypes.object,
};

CustomSkeleton.defaultProps = {
  labelStrong: false,
  colon: true,
  hidden: false,
  layoutCol: { xs: 24 },
  itemStyle: {},
};

export default (CustomSkeleton);
