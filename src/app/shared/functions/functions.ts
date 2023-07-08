import { formatNumber } from '@angular/common';
import { SortingProperties } from '../models';

export function funSortingOrder(event: SortingProperties, selectorValues: any) {
  selectorValues = selectorValues ? selectorValues.split(',') : [];
  const sortValue =
    event.direction === 'asc' ? event.active : '-' + event.active;
  selectorValues.push(sortValue);
  selectorValues = [...new Set(selectorValues)];
  selectorValues.filter((columnName: string, index: number) => {
    columnName = columnName.replace('-', '');
    if (columnName === event.active) {
      event.direction !== ''
        ? (selectorValues[index] = sortValue)
        : selectorValues.splice(index, 1);
    }
  });
  return [...new Set(selectorValues)].toString();
}

export function CheckIsNumber(value: any) {
  if (isNaN(value)) {
    return Number(value.replace(/,/g, ''));
  } else {
    return Number(value);
  }
}

export function SetFormatCurrency(value: any) {
  return formatNumber(Number(value), 'en-IN', '0.2-2');
}

export function formatDate(date: any) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

export function RoundOffAmount(value: any, decimalPlace: number) {
  value = CheckIsNumber(value);
  let decimalvalue: number = 0;
  switch (decimalPlace) {
    case 1:
      decimalvalue = 10;
      break;
    case 2:
      decimalvalue = 100;
      break;
    case 3:
      decimalvalue = 1000;
      break;
    case 4:
      decimalvalue = 10000;
      break;
  }

  value = Math.round(value * decimalvalue) / decimalvalue;

  return value;
}

export function GetFinYearStartDate(InputDate: any, FirstMonth: number) {
  const d = new Date(InputDate);
  const InputMonth: number = d.getMonth() + 1;
  let InputYear: number = d.getFullYear();

  InputYear = InputYear - (InputMonth < FirstMonth - 1 ? 1 : 0);

  const RetutnDate = new Date(InputYear, FirstMonth - 1, 1);

  return RetutnDate;
}

export function GetCrt(Stock: number, Packing: number) {
  if (Stock == 0) return 0;
  return Math.floor(Stock / Packing);
}
export function GetPcs(Stock: number, Packing: number) {
  if (Stock == 0) return 0;
  return Stock - (Math.floor(Stock / Packing) * Packing);
}
