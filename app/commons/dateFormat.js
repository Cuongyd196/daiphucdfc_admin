import moment from 'moment/moment';

export function dateFormatter(stringDate, removeTimeZone) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);

    if(removeTimeZone) return dateFormat.toLocaleString('en-GB', { timeZone: 'UTC' })
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

export function dateFormatterFromYYYYMMDD(dateString) {
  var year        = dateString.substring(0,4);
  var month       = dateString.substring(4,6);
  var day         = dateString.substring(6,8);
  return day + '/' + month + '/' + year
}

export function dateFormatterFromYYYYMM(dateString) {
  var year        = dateString.substring(0,4);
  var month       = dateString.substring(4,6);
  return  month + '/' + year
}

export function monthFormatterShow(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

export function monthFormatter(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}${('0' + (dateFormat.getMonth() + 1)).slice(-2)}`;
  } else {
    return '';
  }
}

function formatDateDMY(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

function formatDateYMD(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${('0' + dateFormat.getDate()).slice(-2)}`;
  } else {
    return '';
  }
}

function formatDateMDY(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${('0' + dateFormat.getDate()).slice(-2)}/${dateFormat.getFullYear()}`;
  } else {
    return '';
  }
}

export function dateFormatYMD(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}-${('0' + (dateFormat.getMonth() + 1)).slice(-2)}-${('0' + dateFormat.getDate()).slice(-2)}`;
  } else {
    return '';
  }
}

export function timeFormatter(stringDate, removeTimeZone) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);    
    if(removeTimeZone) return dateFormat.toLocaleString('en-GB', { timeZone: 'UTC' })
    return `${('0' + dateFormat.getDate()).slice(-2)}/${('0' + (dateFormat.getMonth() + 1)).slice(-2)}/${dateFormat.getFullYear()} - ${('0' + dateFormat.getHours()).slice(-2)}:${('0' + (dateFormat.getMinutes())).slice(-2)}`;
  } else {
    return '';
  }
}

export function formatTimeVer2(time) {
  let hours = new Date(time).getHours();
  return (hours < 10 ? '0' + hours : hours) + ':' + `${('0' + new Date(time).getMinutes()).slice(-2)}`;
}

export function formatTime(time) {
  const now = moment(now);
  let timeNow = new Date(now);
  let date = new Date(time);
  if (date.getDate() === timeNow.getDate() && date.getMonth() === timeNow.getMonth() && date.getFullYear() === timeNow.getFullYear()) {
    if (date.getHours() === timeNow.getHours()) {
      const minutes = timeNow.getMinutes() - date.getMinutes();
      return minutes === 0 ? 'Vừa xọng' : `${minutes} phút trước`;
    } else if (timeNow.getHours() - date.getHours() === 1 &&
      (60 - date.getMinutes() + timeNow.getMinutes()) < 60) {
      const minutes = 60 - date.getMinutes() + timeNow.getMinutes();
      return minutes === 0 ? 'Vừa xong' : `${minutes} phút trước`;
    } else {
      return timeNow.getHours() - date.getHours() + ' giờ trước';
    }
  } else if (date.getDate() !== timeNow.getDate() && date.getFullYear() === timeNow.getFullYear()) {
    return ('0' + (date.getDate())).slice(-2) +
      ' Tháng ' + ('0' + (date.getMonth())).slice(-2) +
      ' lúc ' + ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2);
  } else {
    return ('0' + (date.getDate())).slice(-2) +
      ' Tháng ' + ('0' + (date.getMonth())).slice(-2) +
      ' Năm ' + date.getFullYear();
  }
}

export function getAge(ngaysinh) {
  return moment().diff(moment(ngaysinh), 'years');
  /*var today = new Date(dateCalcul);
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;*/
}
