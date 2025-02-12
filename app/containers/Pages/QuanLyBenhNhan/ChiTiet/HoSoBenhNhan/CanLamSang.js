import React, { useEffect } from 'react';
import { Spin} from 'antd';
import { getKetQuaCLSId } from '@services/qlbenhnhan/qlbenhnhanService';
import ChiTietCanLamSang from '../../ChiTietKetQuaCLS/ChiTietCanLamSang';

const CanLamSang = ({mabn}) => {
  let loaded = false
  const [data, setData] = React.useState([]);
  useEffect(() => {
    fetchData();
  }, [mabn]);

  const fetchData = async () => {
    let data = await getKetQuaCLSId(mabn);
    if (data) {
      setData(data);
    }
    loaded = true
  };

  return <Spin spinning={loaded}>
    {data.length === 0 && loaded && <div className="text-red-500">Không có lịch sử cận lâm sàng</div>}
    {(data.map((item, index) => <ChiTietCanLamSang key={index} khambenh={item}/>))}
  </Spin>;
}

export default CanLamSang


