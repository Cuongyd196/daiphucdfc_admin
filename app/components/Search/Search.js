import React, { Component } from "react";
import moment from "moment";
import { Button, Row, Col, DatePicker, Form, Input, Card, Select, Divider, Space } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import locale from 'antd/es/date-picker/locale/vi_VN';
const { Option } = Select;
class Search extends Component {
  state = {
    showForm: true
  }
  formRef = React.createRef();

  handleFields = fields => {
    for (let key in fields) {
      if (fields.hasOwnProperty(key)) {
        if(fields[key]){
          if(['from_date', 'to_date', 'from_date_1', 'to_date_1'].indexOf(key) >= 0){
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
    onFilterChange?.(fields);
  };

  handleReset = () => {
    const { onFilterReset } = this.props;
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
    onFilterReset?.();
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
              <Input placeholder={data.label} allowClear/>
            </Form.Item>
          </Col>
        );
      }
      else if(data.type === 'date'){
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
              <DatePicker format={"DD/MM/YYYY"} locale={locale} className="w-full" placeholder={data.label}/>
            </Form.Item>
          </Col>
        );
      }
      else if(data.type === 'select'){
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
                onChange={this.onChange.bind(this, data)}
                // onFocus={this.onFocus}
                // onBlur={this.onBlur}
                // onSearch={this.onSearch(data)}
                filterOption={(input, option) => {
                  if(!option.children){
                    return null
                  }
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
              >
                {
                  options.map((opt, idx) => {
                    if (opt.OptGroup) {
                      return (
                        <Select.OptGroup key={idx} label={opt.OptGroup}>
                          {opt.value.map((nestOpt, nestIdx) => {
                            return <Option key={`${idx}.${nestIdx}`} value={nestOpt[data.key]}>{nestOpt[data.value]}</Option>
                          })}
                        </Select.OptGroup>
                      )
                    }
                    return <Option key={idx} value={opt[data.key].toString()}>{opt[data.value]}</Option>
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

  toggleForm = () => {
    this.setState((state) => {return {showForm: !state.showForm}});
  }

  getInitialValues () {
    let search = queryString.parse(this.props.location.search);
    if(search.from_date){
      search.from_date = moment(search.from_date)
    } 
    if(search.to_date){
      search.to_date =  moment(search.to_date)
    } 
    if(search.from_date_1){
      search.from_date_1 =  moment(search.from_date_1)
    } 
    if(search.to_date_1){
      search.to_date_1 =  moment(search.to_date_1)
    }
    return search
  }

  render() {
    let search = this.getInitialValues();
    let {layoutBtn, classNameBtn, buttonExtra} = this.props;
    let layoutColBtn = layoutBtn ? layoutBtn : {xs:24, md:8, xl:6, xxl:4}
    return <Form ref={this.formRef} name="control-ref" className="form-search"
                 initialValues={search} size="small" colon
                 onFinish={this.handleSubmit}
    >
      <Divider orientation="left" plain>
        <span>Điều kiện lọc</span>
      </Divider>

      <Row gutter={10}>
        {this.getFields()}
        <Col {...layoutColBtn} className="">
          <Space>
            <Button htmlType='button' size='small' danger icon={<ClearOutlined />} className={classNameBtn} onClick={this.handleReset}>
              Bỏ lọc
            </Button>
            <Button htmlType='submit' size='small' type='primary' ghost className={classNameBtn} icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
            {buttonExtra}
          </Space>
        </Col>
      </Row>
    </Form>

    /*return (
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
    );*/
  }
}

export default withRouter(Search);
