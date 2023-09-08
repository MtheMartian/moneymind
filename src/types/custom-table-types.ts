type CustomTableTypes = {
  categoryMap: Map<string, {category: string, totalAmount: number}>,
  subCategoryMap: Map<string, {subCategory: string, amount: number}>,
  categoryEntries: [string, {category: string, totalAmount: number}][],
  subCategoryEntries: [string, {subCategory: string, amount: number}][]
}

export type TypeCustomTable = CustomTableTypes;