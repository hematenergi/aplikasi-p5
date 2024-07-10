export const getIdByLabelIncludes = (data, searchString) => {
  const result = data.filter((item) => item.label.includes(searchString))
  return result.map((item) => item.id)
}
