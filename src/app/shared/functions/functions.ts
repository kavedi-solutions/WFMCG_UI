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
