import { TypeCustomTable } from './custom-table-types';
import { convertStringsToWeights } from '../../manager';
import { quickSort } from '../../../../ts/dsa';

export let oldData: {oldTableMap: TypeCustomTable["categoryMap"], oldSubMap: TypeCustomTable["subCategoryMap"], 
              oldBudget: number} = {
  oldTableMap: new Map(),
  oldSubMap: new Map(),
  oldBudget: 0
}

export function todaysDate(): string{
  const currentDate: Date = new Date(Date.now());
  const month: number = currentDate.getMonth() + 1;
  return `${currentDate.getFullYear()}/${month}/${currentDate.getDate()}`;
}

export const linkMap = new Map(); // Used to link daily table to the monthly one

// ******* Sort Tables ******* //
function sortTableItems(categoryMap: TypeCustomTable["categoryMap"] | null, 
                        subCategoryMap: TypeCustomTable["subCategoryMap"] | null,
                        order: string, type: string): any[]{
  
  if(type === "string"){
    const stringArr: string[] = [];
    if(categoryMap){
      const categories = Array.from(categoryMap.values());
      const sortedItems = [];
      categories.forEach(entry =>{
        stringArr.push(entry.category);
      })

      const weightedStrings = convertStringsToWeights(stringArr, "asc");

    }
  }  
  return [];                      
}