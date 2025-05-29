export const formatDateString = (date: Date) =>
  date.toLocaleDateString('en-GB').replace(/\//g, '-');
