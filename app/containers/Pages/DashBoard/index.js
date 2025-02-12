import React from 'react';
import { Card, Row, Col, Radio, Divider, Spin } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { Column, Pie, DualAxes } from '@ant-design/plots';
import { red, gold, green, blue, orange } from '@ant-design/colors';
import {
  dashboardLichHen,
  dashboardThongke,
  dashboardDanhGia,
  dashboardDangKy
} from '@services/dashboard/dashboard';

const TYPE = {
  ALL: '',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

const STATUS = {
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_XAC_NHAN: 'Đã xác nhận',
  DA_KHAM: 'Đã khám',

  CHO_TRA_LOI: 'Chờ trả lời',
  DA_TRA_LOI: 'Đã trả lời',
  TU_CHOI_TRA_LOI: 'Từ chối trả lời',

  DA_TRA_KET_QUA: 'Đã trả kết quả',
  TU_CHOI: 'Từ chối',
};

const STATUSLICHHEN = {
  CHO_XAC_NHAN: 'Mới đặt lịch',
  DA_XAC_NHAN: 'Đã xác nhận',
  DA_KHAM: 'Đã đến khám',
};

const filter = [
  { label: 'Tất cả', value: TYPE.ALL },
  { label: 'Hôm nay', value: TYPE.DAY },
  { label: 'Tuần này', value: TYPE.WEEK },
  { label: 'Tháng này', value: TYPE.MONTH },
  { label: 'Năm này', value: TYPE.YEAR }
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tonglichhen: [],
      lichhen: [],
      lichhenbacsi: [],
      lichhenphauthuat: [],

      danhgiachung: [],
      danhgianv: [],

      dichvu: [],
      hoidap: [],
      dangky: [],
      tongdangky: 0,
      nhanvien: {},
      ready: false,
      filterType: TYPE.ALL,
      filterDangKy: TYPE.DAY
    };
  }

  async componentDidMount() {
    this.loadData()
    this.loadDataDangKy(this.state.filterDangKy)
  }

  async loadData(type) {
    let [lichhen, thongke, danhgia] = await Promise.all([dashboardLichHen({type}),
      dashboardThongke({type}),
      dashboardDanhGia({type})
    ])
    if(lichhen || thongke || danhgia){
      this.setState({
        lichhen: lichhen?.lichhen || [],
        lichhenbacsi: lichhen?.lichhenbacsi || [],
        lichhenphauthuat: lichhen?.lichhenphauthuat || [],
        tonglichhen: lichhen?.tonglichhen || [],
        hoidap: thongke?.hoidap || [],
        dichvu: thongke?.dichvu || [],
        danhgiachung: danhgia?.danhgiachung || [],
        danhgianv: danhgia?.danhgianv || [],
        ready: true
      });
    }
  }

  async loadDataDangKy(type) {
    let [dangky] = await Promise.all([dashboardDangKy({type})])
    if(dangky){
      let tong = 0;
      dangky.forEach(obj => {
        if (obj.tong && typeof obj.tong === 'number') tong = tong + obj.tong;
      })
      this.setState({ dangky: dangky, tongdangky: tong });
    }
  }

  filterOnChange = (e) => {
    let type = e.target.value
    if(type !== this.state.filterType){
      this.setState({filterType: type}, () => this.loadData(type))
    }
  };

  filterOnChangeDangKy = (e) => {
    let type = e.target.value
    if(type !== this.state.filterDangKy){
      this.setState({filterDangKy: type}, () => this.loadDataDangKy(type))
    }
  };


  render() {
    const { ready, dangky } = this.state;

    const configDangKy = {
      data: this.state.dangky,
      xField: 'tennv',
      yField: 'tong',

      label: {
        position: 'top',
        style: {
          fill: '#000000',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoRotate: true
        },
      },
      meta: {
        tong: {
          alias: 'Tổng lượt khám',
        },
        dmphong: {
          alias: 'Phòng khám',
        },
      },
    };

    let configHoiDap = {
      isStack: true,
      xField: 'tennv',
      yField: 'value',
      seriesField: 'type',
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      legend: {
        position: 'top-left',
      },
      color: ({ type }) => {
        if(type === STATUS.CHO_TRA_LOI)
          return gold[4];
        else if(type === STATUS.DA_TRA_LOI)
          return green[4];
        else if(type === STATUS.TU_CHOI_TRA_LOI)
          return red[4];
      },
      label: {
        position: 'middle',
        layout: [{ type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' } ]},
    };

    let config = {
      isStack: true,
      xField: 'name',
      yField: 'value',
      seriesField: 'type',
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      legend: {
        position: 'top-left',
      },
      color: ({ type }) => {
        if(type === STATUS.DA_XAC_NHAN)
          return gold[4];
        else if(type === STATUS.DA_KHAM || type === STATUS.DA_TRA_KET_QUA)
          return green[4];
        else if(type === STATUS.TU_CHOI)
          return orange[4];
        else
          return red[4];
      },
      label: {
        position: 'middle',
        layout: [{ type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' } ]},
    };

    let configLichHen = {
      isStack: true,
      xField: 'tennv',
      yField: 'value',
      seriesField: 'type',
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      legend: {
        position: 'top-left',
      },
      color: ({ type }) => {
        if(type === STATUSLICHHEN.CHO_XAC_NHAN)
          return gold[4];
        else if(type === STATUSLICHHEN.DA_XAC_NHAN)
          return blue[4];
        else if(type === STATUSLICHHEN.DA_KHAM)
          return green[4];

      },
      label: {
        position: 'middle',
        layout: [{ type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' } ]},
    };

    const configDanhGia = {
      data: [this.state.danhgiachung, this.state.danhgiachung],
      xField: 'dmdanhgia',
      yField: ['trungbinh', 'luotdanhgia'],
      meta: {
        trungbinh: {
          alias: 'Điểm trung bình',
        },
        luotdanhgia: {
          alias: 'Tổng lượt đánh giá'
        }
      },
      yAxis: {
        trungbinh: {
          min: 0,
          max: 5
        },
        luotdanhgia: {
          min: 0
        }
      },
      geometryOptions: [
        {
          geometry: 'column',
        },
        {
          geometry: 'line',
          lineStyle: {
            lineWidth: 2,
          },
        },
      ],
    };


    return (
      <div>
        <br></br>
       <center>TRANG QUẢN LÝ WEBSITE </center> 

      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

export default connect(mapStateToProps)(Dashboard);
