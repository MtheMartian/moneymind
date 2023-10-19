type CustomTableTypes = {
  categoryMap: Map<string, {category: string,amount: number}>,
  subCategoryMap: Map<string, {subCategory: string, amount: number, categoryId: string}>,
  categoryEntries: [string, {category: string, amount: number}][],
  subCategoryEntries: [string, {subCategory: string, amount: number, categoryId: string}][]
}

export type TypeCustomTable = CustomTableTypes;