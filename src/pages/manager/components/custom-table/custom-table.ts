import { TypeCustomTable } from './custom-table-types';
import { convertStringToWeight, prefixURL } from '../../manager';
import { quickSort, BSTNode } from '../../../../ts/dsa';

export let oldData: {oldEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldSubEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldBudget: number} = {
  oldEntries: [],
  oldSubEntries: [],
  oldBudget: 0
}

export const customTableVariables: {customBSTVariable: number, customBSTNodeOrder: string} = {
  customBSTVariable: 0,
  customBSTNodeOrder: "desc"
}

export const currentURLSearchParams: URLSearchParams = new URL(window.location.href).searchParams;
const currentDate: Date = new Date(Date.now());

export function returnRequestURLForSave(): string{
  if(currentURLSearchParams.has("id")){
    const tempStr: string | null = currentURLSearchParams.get("id");

    if(tempStr){
      return `${prefixURL}tables/entry?id=${tempStr}`;
    }
  }

  if(currentURLSearchParams.has("year") || currentURLSearchParams.has("month")){
    const tempStr = currentURLSearchParams.get("year");
    const tempStr2 = currentURLSearchParams.get("month");
    return `${prefixURL}tables/period?year=${tempStr ? tempStr : currentDate.getUTCFullYear()}&month=${tempStr2 ? tempStr2 : currentDate.getUTCMonth() + 1}`;
  }

  return `${prefixURL}tables/period?year=${currentDate.getUTCFullYear()}&month=${currentDate.getUTCMonth() + 1}`;
}

export const linkMap = new Map(); // Used to link daily table to the monthly one

// ******* Sort Tables ******* //
