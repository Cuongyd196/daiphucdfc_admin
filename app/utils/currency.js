export default function formatCurrency(value, { suffix, precision } = { suffix: "VNĐ", precision: 0 }) {
  value = +value;
  if (!Number.isNaN(value)) {
    value = +value.toFixed(precision);
  } else {
    value = 0;
  }
  return `${value.toLocaleString()} ${suffix}`;
}
