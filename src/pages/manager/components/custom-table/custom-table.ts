import { TypeCustomTable } from './custom-table-types';
import { convertStringsToWeights } from '../../manager';
import { quickSort, BSTNode } from '../../../../ts/dsa';

export let oldData: {oldEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldSubEntries: BSTNode<TypeCustomTable["customTableEntry"]>[], 
                    oldBudget: number} = {
  oldEntries: [],
  oldSubEntries: [],
  oldBudget: 0
}

export function todaysDate(): string{
  const currentDate: Date = new Date(Date.now());
  const month: number = currentDate.getMonth() + 1;
  return `${currentDate.getFullYear()}/${month}/${currentDate.getDate()}`;
}

export const linkMap = new Map(); // Used to link daily table to the monthly one

// ******* Sort Tables ******* //
function stringsfromWeightMap(weightMap: Map<number, string[]>) : string[]{
  const strArr: string[] = [];

  Array.from(weightMap.values()).forEach(entry =>{
    entry.forEach(str =>{
      strArr.push(str);
    })
  });

  return strArr;
}

export function sortCategories(categoryMap: TypeCustomTable["categoryMap"], order: string): TypeCustomTable["categoryEntries"]{
  const categories = Array.from(categoryMap.entries());
  const stringArr: string[] = [];
  const sortedItems: TypeCustomTable["categoryEntries"] = [];

  for(let i: number = 0; i < categories.length; i++){
    stringArr.push(categories[i][1].category);
  }

  const weightedStringsMap = convertStringsToWeights(stringArr, order);

  const sortedStrings = stringsfromWeightMap(weightedStringsMap);

  sortedStrings.forEach(str =>{
    categories.forEach(category =>{
      if(str === category[1].category){
        sortedItems.push(category);
      }
    });
  });

  return sortedItems;

}