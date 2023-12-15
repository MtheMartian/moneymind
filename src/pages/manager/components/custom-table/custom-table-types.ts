type CustomTableTypes = {
  categoryMap: Map<string, {category: string,amount: number}>,
  subCategoryMap: Map<string, {subCategory: string, amount: number, categoryId: string}>,
  categoryEntries: [string, {category: string, amount: number}][],
  subCategoryEntries: [string, {subCategory: string, amount: number, categoryId: string}][],
  customTableEntry: {entryName: string, entryAmount: number, isCategory: boolean,
                      linkId: string, lastUpdated: number, dateCreated: number,
                        initalAmount: number, isMonthly: boolean};
}

export type TypeCustomTable = CustomTableTypes;