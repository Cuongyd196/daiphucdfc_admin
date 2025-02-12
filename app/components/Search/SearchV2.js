import React, { Component } from "react";
import moment from "moment";
import { Button, Row, Col, DatePicker, Form, Input, Card, Select } from "antd";
import { FileSearchOutlined, SearchOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { Link, withRouter } from "react-router-dom";

const { RangePicker } = DatePicker;
import locale from 'antd/es/date-picker/locale/vi_VN';
import classnames from 'classnames';
const { Option } = Select;
class SearchV2 extends Component {
  state = {
    showForm: true
  }
  formRef = React.createRef();

  handleFields = fields => {
    for (let key in fields) {
      if (fields.hasOwnProperty(key)) {
        if(fields[key]){
          if(key === 'from_date' || key === 'to_date'){
            fields[key] = moment(fields[key]).format("YYYY-MM-DD")
          }
        }else{
          fields[key] = undefined
        }
      }
    }
    return fields;
  };

  handleSubmit = () => {
    const { onFilterChange } = this.props;
    const values = this.formRef.current.getFieldsValue();
    const fields = this.handleFields(values);
    onFilterChange(fields);
  };

  handleReset = () => {
    const fields = this.formRef.current.getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    this.formRef.current.setFieldsValue(fields);
    this.handleSubmit();
  };

  getFields() {
    let {dataSearch} = this.props
    let children = [];
    for (let i = 0; i < dataSearch.length; i++) {
      let data = dataSearch[i]
      if(data.type === 'text'){
        children.push(
          <Col
            xl={{ span: data.xl ? data.xl : 6 }}
            md={{ span: 12 }}
            sm={{ span: 24 }}
            key={i}>
            <Form.Item
              name={data.name}
              label={data.label}
              labelCol={{
                span: 8
              }}
              wrapperCol={{
                span: 16
              }}
            >
              <Input placeholder={data.label}/>
            </Form.Item>
          </Col>
        );
      }else if(data.type === 'date'){
        children.push(
          <Col
            xl={{ span: data.xl ? data.xl : 6 }}
            md={{ span: 12 }}
            sm={{ span: 24 }}
            key={i}>
            <Form.Item
              name={data.name}
              label={data.label}
              labelCol={{
                span: 8
              }}
              wrapperCol={{
                span: 16
              }}
            >
              <DatePicker format={"DD/MM/YYYY"} locale={locale} className="w-100" placeholder={data.label}/>
            </Form.Item>
          </Col>
        );
      }else if(data.type === 'select'){
        let {options} = data
        children.push(
          <Col
            xl={{ span: data.xl ? data.xl : 6 }}
            md={{ span: 12 }}
            sm={{ span: 24 }}
            key={i}>
            <Form.Item
              name={data.name}
              label={data.label}
              labelCol={{
                span: 8
              }}
              wrapperCol={{
                span: 16
              }}
            >
              <Select
                showSearch
                allowClear={true}
                placeholder={data.label}
                // optionFilterProp="children"
                onChange={this.onChange.bind(this, data)}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onSearch={this.onSearch(data)}
                filterOption={(input, option) => {
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
              >
                {
                  options.map((opt, idx) => {
                    return <Option value={opt[data.key]} key={idx}>{opt[data.value]}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        );
      }

    }
    return children;
  }

  onChange(data, value, ) {
    if(data.children){
      this.formRef.current.setFieldsValue(data.children);
    }
    if(data.onChange){
      data.onChange(value, data.name)
    }
  }
  onBlur() {
    console.log('blur');
  }
  onFocus() {
    console.log('focus');
  }
  onSearch(val, data) {
    // console.log('search:', val, data);
  }

  toggleForm = () => {
    this.setState((state) => {return {showForm: !state.showForm}});
  }

  getInitialValues () {
    let search = queryString.parse(this.props.location.search);
    if(search.from_date){
      let from_date = moment(search.from_date)
      search.from_date = from_date
    }
    if(search.to_date){
      let to_date = moment(search.to_date)
      search.to_date = to_date
    }
    return search
  }
  render() {
    let search = this.getInitialValues();
    return (
      <Card size="small" title={<span>

        {
          this.state.showForm ? <CaretDownOutlined className="icon-card-header" onClick={this.toggleForm}/> :
            <CaretUpOutlined className="icon-card-header" onClick={this.toggleForm}/>
        }
         &nbsp;Điều kiện tìm kiếm
      </span>} md="24" className={classnames('card-form-search', {'card-form-search-hidden': !this.state.showForm})} extra={<div>
        <Button onClick={this.handleReset} icon={<DeleteOutlined/>} type="danger" size="small">
          Xóa bộ lọc
        </Button>&nbsp;
        <Button
          type="primary" htmlType="submit"
          // className="margin-right"
          onClick={this.handleSubmit}
          icon={<SearchOutlined/>}
          size="small"
        >
          Tìm kiếm
        </Button>
      </div>}>
        <Form ref={this.formRef} name="control-ref" className="form-search"
              initialValues={search} size="small" colon={false} colon>
          <Row gutter={24}>
            {this.getFields()}
          </Row>
        </Form>
      </Card>
    );
  }
}

export default withRouter(SearchV2);
