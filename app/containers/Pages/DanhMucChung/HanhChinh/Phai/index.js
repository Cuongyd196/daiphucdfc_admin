import React, { Component, } from 'react';
import { Table, Card } from "antd";
import { UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { getAll } from '@services/danhmuchanhchinh/danhmucphaiService';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
class DanhMucPhai extends Component {

  columns = [
    {
      title: 'Mã giới tính',
      dataIndex: '_id',
      width: 120,
      align: 'center'
    },
    {
      title: 'Giới tính',
      dataIndex: 'tenphai'
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: []
    };
  }

  componentDidMount() {
    this.getDataFilter();
  }

  async getDataFilter() {
    const apiResponse = await getAll(1, 0);
    const dataRes = apiResponse.docs;
    if (apiResponse) {
      this.setState({ dataRes });
    }
  }

  render() {
    const { loading } = this.props;
    const { dataRes } = this.state;
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh mục giới tính
      </span>}>
        <Table loading={loading} bordered columns={this.columns} dataSource={dataRes}
          size="small" rowKey="_id"
          pagination={false} />
      </Card>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(DanhMucPhai);


