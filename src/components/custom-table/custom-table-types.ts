type CustomTableTypes = {
  categoryMap: Map<string, {category: string,amount: number}>,
  subCategoryMap: Map<string, {subCategory: string, amount: number, categoryId: string}>,
  categoryEntries: [string, {category: string, amount: number}][],
  subCategoryEntries: [string, {subCategory: string, amount: number, categoryId: string}][],
  customTableEntry: {
    id: string,
    dateCreated: number,
    lastUpdated: number,
    entryName: string,
    entryAmount: number,
    initialAmount: number,
    isMonthly: boolean,
    isCategory: boolean,
    linkID: string
  }
}

export type TypeCustomTable = CustomTableTypes;