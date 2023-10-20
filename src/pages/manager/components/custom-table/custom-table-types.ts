type CustomTableTypes = {
  categoryMap: Map<string, {category: string,amount: number}>,
  subCategoryMap: Map<string, {subCategory: string, amount: number, categoryId: string}>,
  categoryEntries: [string, {category: string, amount: number}][],
  subCategoryEntries: [string, {subCategory: string, amount: number, categoryId: string}][],
  customTableMap: Map<string, {entryName: string, entryAmount: number,
                              entryId: string | null, lastUpdated: number,
                              initalAmount: number}>
}

export type TypeCustomTable = CustomTableTypes;