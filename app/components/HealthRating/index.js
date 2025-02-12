import React from "react";
import { Slider } from "antd";

export default function HealthRating(props) {
  const { data = [], value, onChange, ...restProps } = props;

  const min = 0;
  const max = (data.length || 1) - 1;

  const keysData = data.reduce((acc, cur, i) => {
    acc[cur._id] = i;
    return acc;
  }, {});

  const marksData = data.reduce((acc, cur, i) => {
    const mark = {};
    mark.label = cur.xeploai;
    if (i === min) {
      mark.style = { transform: undefined, left: 0 };
    }
    if (i === max) {
      mark.style = { transform: undefined, left: undefined, right: 0 };
    }
    if (cur.mamau) {
      mark.style = { ...mark.style, color: cur.mamau };
    }
    acc[i] = mark;
    return acc;
  }, {});

  const onValueChange = newIndex => {
    const newValue = data[newIndex]?._id;
    onChange(newValue);
  };

  return (
    <Slider
      min={0}
      max={max}
      marks={marksData}
      tipFormatter={i => data[i]?.ghichu}
      {...restProps}
      value={keysData[value]}
      onChange={onValueChange}
    />
  );
}
