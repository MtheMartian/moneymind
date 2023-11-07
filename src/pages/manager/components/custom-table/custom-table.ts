import { TypeCustomTable } from './custom-table-types';
import { convertStringToWeight } from '../../manager';
import { quickSort, BSTNode } from '../../../../ts/dsa';

export let oldData: {oldEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldSubEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldBudget: number} = {
  oldEntries: [],
  oldSubEntries: [],
  oldBudget: 0
}

export const customTableVariables: {customBSTVariable: number} = {
  customBSTVariable: 0
}

export function todaysDate(): string{
  const currentDate: Date = new Date(Date.now());
  const month: number = currentDate.getMonth() + 1;
  return `${currentDate.getFullYear()}/${month}/${currentDate.getDate()}`;
}

export const linkMap = new Map(); // Used to link daily table to the monthly one

// ******* Sort Tables ******* //
