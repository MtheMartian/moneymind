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

export const customTableVariables: {customBSTVariable: number, customBSTNodeOrder: string} = {
  customBSTVariable: 0,
  customBSTNodeOrder: "desc"
}

export const currentURLSearchParams: URLSearchParams = new URL(window.location.href).searchParams;

function returnRequestURLBasedOnSearchParams(typeRequest: string): string{

}

export const linkMap = new Map(); // Used to link daily table to the monthly one

// ******* Sort Tables ******* //
