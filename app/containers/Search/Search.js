import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { CONSTANTS } from '@constants';
import './Search.scss';
import Box from '@containers/Box';

const layoutCol = { 'xs': 24, 'sm': 24, 'md': 12, 'lg': 12, 'xl': 8, 'xxl': 8 };

const layoutItem = {
  labelAlign: 'left',
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChanged: false,
    };

    this.formRef = React.createRef();
  }

  renderFilterText(data) {
    const { loading } = this.props;

    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Input placeholder={data.label} disabled={loading} allowClear/>
      </Form.Item>
    </Col>;
  }

  renderFilterNumber(data) {
    const { loading } = this.props;

    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <InputNumber placeholder={data.label} disabled={loading} allowClear style={{ width: '100%' }}/>
      </Form.Item>
    </Col>;
  }

  renderFilterSelect(data) {
    const { loading } = this.props;

    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Select placeholder={`Chọn ${data.label}`} disabled={loading} dropdownClassName='small'
                allowClear showSearch={data.showSearch}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
          {Array.isArray(data.options) && data.options.map(option => {
            return <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>;
          })}

          {(typeof data.options === 'object' && Array.isArray(data.options.data))
          && data.options.data.map(option => {
            return <Select.Option
              key={option.value || option[data.options.valueString]}
              value={option.value || option[data.options.valueString]}>
              {option.label || option[data.options.labelString]}
            </Select.Option>;
          })}
        </Select>
      </Form.Item>
    </Col>;
  }

  renderFilterMultiSelect(data) {
    const { loading } = this.props;

    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Select placeholder={`Chọn ${data.label}`} disabled={loading} dropdownClassName='small'
                allowClear mode="multiple">
          {Array.isArray(data.options) && data.options.map(option => {
            return <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>;
          })}
        </Select>
      </Form.Item>
    </Col>;
  }

  renderFilterDate(data) {
    const { loading } = this.props;

    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <DatePicker size='small' style={{ width: '100%' }} format="DD-MM-YYYY"
                    placeholder={`Chọn ${data.label}`} disabled={loading}
                    dropdownClassName='small'/>
      </Form.Item>
    </Col>;
  }

  clearSearch() {
    if (this.formRef && this.formRef.current)
      this.formRef.current.resetFields();
    if (!this.state.isChanged)
      this.setState({ isChanged: true });
  }

  filter(value) {
    this.setState({ isChanged: false });
    if (this.props.handleSearch) {
      this.props.handleSearch(value);
    }
  }

  onValuesChange(changedValues, allValues) {
    const { clearWhenChanged } = this.props;
    if (!this.state.isChanged) {
      this.setState({ isChanged: true });
    }
    if (this.props.onSearchChange)
      this.props.onSearchChange(
        JSON.parse(JSON.stringify(changedValues)),
        JSON.parse(JSON.stringify(allValues)));

    if (clearWhenChanged) {
      Object.keys(changedValues).forEach(key => {
        clearWhenChanged.forEach(item => {
          if (key === item.change) {
            this.formRef.current.setFieldsValue({ [item.clear]: undefined });
          }
        });
      });
    }
  }

  render() {
    const { loading } = this.props;
    const dataSearch = Array.isArray(this.props.dataSearch) ? this.props.dataSearch : [];

    return <div className='custom-search'>
      <Box title='Điều kiện tìm kiếm'>
        <Form ref={this.formRef} autoComplete='off' size='small' colon={false}
              className='form-no-feedback'
              onValuesChange={this.onValuesChange.bind(this)}
              onFinish={this.filter.bind(this)}>
          <Row gutter={15}>
            {dataSearch.map(search => {
              if (search.type === CONSTANTS.TEXT)
                return this.renderFilterText(search);
              if (search.type === CONSTANTS.SELECT)
                return this.renderFilterSelect(search);
              if (search.type === CONSTANTS.MULTI_SELECT)
                return this.renderFilterMultiSelect(search);
              if (search.type === CONSTANTS.DATE)
                return this.renderFilterDate(search);
              if (search.type === CONSTANTS.NUMBER)
                return this.renderFilterNumber(search);
            })}

            <Col {...layoutCol} className='ml-auto'>
              <Button htmlType='submit' size='small' type='primary' className='float-right'
                      disabled={loading || !this.state.isChanged}
                      icon={<i className="fa fa-filter mr-1"/>}>
                Tìm kiếm
              </Button>
              <Button htmlType='button' size='small' className='float-right mr-2' disabled={loading}
                      icon={<ClearOutlined/>} onClick={this.clearSearch.bind(this)}>
                Xoá bộ lọc
              </Button>
            </Col>
          </Row>
        </Form>
      </Box>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(Search);
