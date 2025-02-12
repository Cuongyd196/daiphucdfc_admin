import React from "react";
import { Button, Result } from "antd";
import { URL } from "@url";

class NotFound extends React.Component {
  backHome = () => {
    this.props.history.push(URL.HOMEPAGE);
  };

  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đã truy cập không tồn tại."
        extra={
          <Button type="primary" onClick={this.backHome}>
            Trở về Trang chủ
          </Button>
        }
      />
    );
  }
}

export default NotFound;
