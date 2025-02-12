import React, { useEffect, useState } from 'react';
import { ArrowDownOutlined, SendOutlined } from '@ant-design/icons';
import { createHoiDapMessage, getHoiDapMessage } from '@services/danhmucchung/hoidap/hoidapService';
import { Button, Col, Divider, Image, Input, List, Modal, Row, Typography } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import useWindowDimensions from '@utils/useWindowDimensions ';
import { API } from '@api';
import ImgUplMulti from '@components/ImageUploadComp/ImgUplMulti';
import { uploadImages } from '@services/uploadServices';
import { getfileDetail } from '@commons/functionCommons';

const HoiDapMessageModal = (props) => {
  const { hoidap_id, hoidap_data, visible, onCancel } = props;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loadmore, setLoadmore] = useState(true);
  const [text, setText] = useState('');
  const [imageList, setImageList] = useState([]);
  const [goToTop, setGoToTop] = useState(false);
  const { height, width } = useWindowDimensions();

  const loadMoreData = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const data = await getHoiDapMessage(hoidap_id, page, limit);
      if (data && data.docs.length > 0) {
        if (data.hasNextPage === false) setLoadmore(false);
        setPage(page + 1);
        let nextMessage = [...data.docs.reverse(), ...message];
        setMessage(removerSameKey(nextMessage));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const removerSameKey = (arr) => {
    let count = {};
    arr.forEach((e) => {
      if (count[e._id]) count[e._id]++;
      else count[e._id] = 1;
    });
    let res = arr.filter((e) => count[e._id] === 1);
    return res;
  };

  const onSend = async () => {
    let messageReq = {
      hoidap_id: hoidap_id,
      isAdminMessage: true,
      message: text,
    };
    let [originFileNm, fileUpload] = getfileDetail(imageList);
    if (fileUpload.length) {
      const image_id_list = await uploadImages(fileUpload);
      if (image_id_list && image_id_list.length) originFileNm = [...originFileNm, ...image_id_list];
    }
    messageReq.hinhanh = originFileNm;
    const data = await createHoiDapMessage(messageReq);
    if (data) {
      let newMessage = { ...data, localMessage: true };
      setMessage([...message, newMessage]);
    }
    setText('');
    setImageList([]);
    scrollToTop();
  };

  const renderMessage = (item) => {
    return (
      <List.Item key={item._id}>
        <List.Item.Meta
          title={
            <Row>
              <Col flex={'auto'}>
                <b>
                  {item.isAdminMessage ? item.hoidap_id.nguoitraloi_id.full_name : hoidap_data?.mabn?.hoten}
                </b>
              </Col>
              <Col>
                <Typography.Text type='secondary'>
                  {moment(item.created_at).format('HH:mm DD-MM-YY')}
                </Typography.Text>
              </Col>
            </Row>
          }
        />
        {item.message}
        <br />
        {item?.hinhanh?.length > 0 ? (
          <div
            style={{
              width: 460,
              overflowX: 'scroll',
            }}
          >
            {item.hinhanh.map((e) => (
              <Image style={{ padding: 2 }} key={e} width={80} height={80} src={API.FILES.format(e)} />
            ))}
          </div>
        ) : null}
      </List.Item>
    );
  };

  const onChangeImageList = (imageList) => {
    setImageList(imageList);
  };

  const scrollToTop = () => {
    var objDiv = document.getElementById('scrollableDiv');
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  return (
    <Modal
      title={hoidap_data?.mabn?.hoten}
      visible={visible}
      onCancel={() => onCancel()}
      footer={null}
      centered
    >
      <div
        id='scrollableDiv'
        onScroll={(e) => {
          var objDiv = document.getElementById('scrollableDiv');
          if (Math.abs(objDiv.scrollTop) > 400) setGoToTop(true);
          else setGoToTop(false);
        }}
        style={{
          height: 'calc(100vh - 400px)',
          minHeight: 200,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <InfiniteScroll
          dataLength={message.length}
          next={loadMoreData}
          hasMore={loadmore}
          loader={
            <Divider plain>
              {!loading && message.length === 0 ? 'Bắt đầu trò chuyện' : 'Đang tải'}
            </Divider>
          }
          endMessage={<Divider plain>Không còn tin nhắn nào</Divider>}
          scrollableTarget='scrollableDiv'
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          inverse={true}
          scrollThreshold={0.9}
        >
          <List dataSource={message} renderItem={(item) => renderMessage(item)} />
        </InfiniteScroll>
        {goToTop ? (
          <Button
            type='primary'
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              borderRadius: 9999,
              left: 0,
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            shape='circle'
            icon={<ArrowDownOutlined />}
            onClick={scrollToTop}
          />
        ) : null}
      </div>
      <Row style={{ marginTop: 10 }}>
        <Col style={{ flex: 1, marginRight: 5 }}>
          <Input
            style={{ marginRight: 0 }}
            placeholder='Aa'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={onSend} style={{ marginRight: 0 }} icon={<SendOutlined />} type='primary' />
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <ImgUplMulti fileListOrg={imageList} onChange={onChangeImageList} />
      </Row>
    </Modal>
  );
};

export default HoiDapMessageModal;
