import { Button, Typography } from 'antd';
import React, { useState } from 'react';
const { Paragraph, Text } = Typography;
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
const ParagraphText = ({content, rows=2}) => {
  const [opened, setOpened] = useState(false)
  const toggle = () => {
    setOpened(!opened)
  }
  return <>
    <Paragraph ellipsis={!opened ? {
      rows: 2,
      expandable: false
    } : false} className="whitespace-pre-wrap">{content}</Paragraph>
    <Button type="link" onClick={toggle} icon={opened ? <UpCircleOutlined/> : <DownCircleOutlined/>}>
      {opened ? 'Ẩn bớt' : 'Mở rộng'}
    </Button>
  </>
}

export default ParagraphText
