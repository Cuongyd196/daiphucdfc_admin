import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Tabs, Form, Modal, Spin, Tooltip, Timeline, Typography, Button } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import CustomSkeleton from "@containers/CustomSkeleton";
import { makeGetLoading } from "containers/App/AppProvider/selectors";
import { URL } from "@url";
import { dateFormatter } from "@commons/dateFormat";
import { getById as getBenhNhan, getLinkSuKham } from '@services/qlbenhnhan/qlbenhnhanService'
import '../../SCSS/index.scss'

const LichsukhamDialog = React.forwardRef((props, ref) => {
  const { khamId } = props;

  const loading = useSelector(makeGetLoading());

  const [benhnhan, setBenhNhan] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [histories, setHistories] = React.useState([]);

  const open = id => {
    setVisible(true);
    fetchBenhNhan(id);
  };

  const close = () => {
    setVisible(false);
  };

  const fetchBenhNhan = async id => {
    const [benhnhanRes, historyRes] = await Promise.all([getBenhNhan(id), getLinkSuKham(id)]);
    if (benhnhanRes) {
      setBenhNhan(benhnhanRes);
    }
    if (historyRes) {
      setHistories(historyRes);
    }
  };

  React.useImperativeHandle(ref, () => ({
    open,
    close
  }));

  return (
    <Modal
      title="Lịch sử khám bệnh" labelStrong
      footer={null}
      visible={visible}
      onCancel={close}
      className="modal-width-60"
      bodyStyle={{ paddingTop: 10, paddingBottom: 0 }}
      destroyOnClose
      style={{ top: 10 }}
    >
      <Spin spinning={loading}>
        <Form size="small">
          <Tabs size="small">
            {
              props.kiemtra === "1" ? <>
                <Tabs.TabPane tab="Thông tin bệnh nhân">
                  <Row>
                    <CustomSkeleton label="Tên bệnh nhân" layoutCol={{ sm: 24, lg: 12, xl: 8, xxl: 6 }} labelStrong>
                      {benhnhan.hoten}
                    </CustomSkeleton>
                    <CustomSkeleton label="Ngày sinh" layoutCol={{ sm: 24, lg: 12, xl: 8, xxl: 6 }} labelStrong>
                      {dateFormatter(benhnhan.ngaysinh)}
                    </CustomSkeleton>
                  </Row>
                  <Row>
                    <CustomSkeleton label="Giới tính" layoutCol={{ sm: 24, lg: 12, xl: 8, xxl: 6 }} labelStrong>
                      {benhnhan.maphai?.tenphai}
                    </CustomSkeleton>
                    <CustomSkeleton label="Điện thoại" layoutCol={{ sm: 24, lg: 12, xl: 8, xxl: 6 }} labelStrong>
                      {benhnhan.dienthoai}
                    </CustomSkeleton>
                  </Row>
                </Tabs.TabPane>
              </> : ""
            }
          </Tabs>
          <Tabs size="small">
            <Tabs.TabPane tab="Lịch sử khám">
              {!loading && !histories.length && "Dữ liệu trống"}
              <Timeline mode="left" className="healthcare__timeline">
                {histories.map(detail => (
                  <Timeline.Item
                    key={detail._id}
                    label={
                      khamId && khamId === (detail.khamchuabenh_id?._id || detail._id) ? (
                        <Typography.Link className="d-flex text-left font-weight-bold">
                          {dateFormatter(detail.created_at)}
                        </Typography.Link>
                      ) : (
                        <Tooltip title="Xem chi tiết">
                          <Link to={URL.QL_DANGKYKHAM_ID.format(detail._id)} onClick={close} className="d-flex text-left text-dark font-weight-bold">
                            {dateFormatter(props?.dateDangChon) === dateFormatter(detail.ngaydk) ?
                              <span className="span_date_da_chon">{dateFormatter(detail.ngaydk)}</span> :
                              dateFormatter(detail.ngaydk)
                            }
                            <Button type="link" icon={<RightCircleOutlined />}
                                    onClick={close}></Button>
                          </Link>
                        </Tooltip>
                      )
                    }
                    position="right"
                  >
                    <Row>
                      <CustomSkeleton label="Mã đăng ký" layoutCol={{ sm: 24, lg: 12, }} labelStrong>
                        {detail._id}
                      </CustomSkeleton>
                      <CustomSkeleton label="Phòng khám" layoutCol={{ sm: 24, lg: 12 }} labelStrong>
                        {detail.dmphong_id?.fullname}
                      </CustomSkeleton>
                    </Row>
                    {!detail.khamchuabenh && (
                      <Row>
                        <CustomSkeleton label="Số thứ tự đăng ký" layoutCol={{ sm: 24, lg: 12 }} labelStrong>
                          {detail.number}
                        </CustomSkeleton>
                      </Row>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
});

export default LichsukhamDialog;
