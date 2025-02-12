import React, { Component, Fragment } from 'react';
import { Button } from 'antd';

class FooterModalDetail extends Component {

  render() {
    const { isEdit, disabled } = this.props;
    return <Fragment>
      <Button key={1} size='small' type='danger' onClick={this.props.toggleModal} disabled={disabled}>
        <i className='fa fa-times mr-1'/>Huỷ
      </Button>,
      <Button key={2} size='small' type="primary" htmlType="submit" form="formModal" loading={disabled}>
        <i className='fa fa-save mr-1'/>{isEdit ? 'Lưu' : 'Thêm mới'}
      </Button>,
    </Fragment>;
  }
}

export default FooterModalDetail;
