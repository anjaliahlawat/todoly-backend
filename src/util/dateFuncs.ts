import * as moment from "moment";

const isValidDate = (inputDate: Date | string): boolean => {
  const currDateMomentObj = moment(new Date()).utcOffset("+05:30");
  const inputDateMomentObj = moment(new Date(inputDate)).utcOffset("+05:30");
  return inputDateMomentObj.isAfter(currDateMomentObj);
};

const getTodaysDateInIST = (): Date => {
  return moment(new Date()).utcOffset("+05:30").toDate();
};

const addDaysToCurrentDate = (days: number): Date => {
  return moment(new Date()).utcOffset("+05:30").add("days", days).toDate();
};

export { addDaysToCurrentDate, getTodaysDateInIST, isValidDate };
