type CustomTableTypes = {
  categoryMap: Map<string, React.JSX.Element>,
  subCategoryMap: Map<string, {subCategory: string, amount: number}>,
  categoryEntries: React.JSX.Element[],
  subCategoryEntries: [string, {subCategory: string, amount: number}][]
}

export type TypeCustomTable = CustomTableTypes;