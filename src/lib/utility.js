const parseDateVector = (timestamp) => {
  const dateObj = new Date(timestamp);
  const date = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed (0 = Jan)
  const year = dateObj.getFullYear();

  return [date, month, year];
}

const parseDateToString = (timestamp) => {
  const dateObj = new Date(timestamp);
  const date = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed (0 = Jan)
  const year = dateObj.getFullYear();

  return `${date<10?'0':''}${date}/${month<10?'0':''}${month}/${year<10?'00':(year<100?'0':'')}${year}`;
}

const parseTimeVector = (timestamp) => {
  const dateObj = new Date(timestamp);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return [hours, minutes];
}

const getTimeDifference = (timestamp1, timestamp2) => {
  // Accept Date objects, timestamps (ms) or date strings
  const toMs = (t) => (t instanceof Date ? t.getTime() : new Date(t).getTime());
  const t1 = toMs(timestamp1);
  const t2 = toMs(timestamp2);
  let diffs = Math.floor(Math.abs(t1 - t2)/1000);
  const days = Math.floor(diffs/86400);
  diffs %= 86400;
  const hours = Math.floor(diffs/3600);
  diffs %= 3600;
  const minutes = Math.floor(diffs/60);
  diffs %= 60;
  return [diffs, minutes, hours, days];
}

const parseDurationVector = (diffms) =>{
  const diffs = Math.floor(Math.abs(diffms)/1000);
  let days = Math.floor(diffs/86400);
  diffs %= 86400;
  const hours = Math.floor(diffs/3600);
  diffs %= 3600;
  const minutes = Math.floor(diffs/60);
  diffs %= 60;
  return [diffs, minutes, hours, days];
}

export {parseDateVector, parseTimeVector, getTimeDifference, parseDateToString, parseDurationVector};