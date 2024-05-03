export function getDirtyFields(
  originalObj: Record<string, any>,
  updatedObj: typeof originalObj
) {
  const dirtyFields: Partial<typeof originalObj> = {}

  for (const key in updatedObj) {
    if (updatedObj.hasOwnProperty(key) && originalObj.hasOwnProperty(key)) {
      if (originalObj[key] !== updatedObj[key]) {
        dirtyFields[key] = updatedObj[key]
      }
    }
  }

  return dirtyFields
}
