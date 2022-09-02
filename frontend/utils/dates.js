const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekdayShort = weekdays.map((weekday) => weekday.substring(0, 3));
const monthShort = months.map((month) => month.substring(0, 3));

export const timeAgo = (date) => {
  const formattedDate = new Date(date);
  const currentDate = new Date();
  const diffHours = Math.floor((currentDate - formattedDate) / 36e5);
  const diffMinutes = Math.floor((currentDate - formattedDate) / 6e4);

  if (diffHours < 24 && diffHours > 0) {
    if (diffHours == 1) {
      return `${diffHours} hour ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffMinutes < 10 && diffMinutes >= 0) {
    return 'Just now';
  } else if (diffHours == 0) {
    if (diffMinutes == 1) {
      return `${diffMinutes} min ago`;
    }
    return `${diffMinutes} mins ago`;
  }

  return formatShort(formattedDate);
};

export const formatShort = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${
    monthShort[formattedDate.getMonth()]
  } ${formattedDate.getFullYear()}`;
};
