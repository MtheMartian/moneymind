import { TypeCustomTable } from './custom-table-types';

export let oldData: {oldTableMap: TypeCustomTable["categoryMap"], oldSubMap: TypeCustomTable["subCategoryMap"], 
              oldBudget: number} = {
  oldTableMap: new Map(),
  oldSubMap: new Map(),
  oldBudget: 0
}

export function todaysDate(): string{
  const currentDate: Date = new Date(Date.now());
  return `${currentDate.getFullYear()}/${currentDate.getMonth()}/${currentDate.getDate()}`;
}