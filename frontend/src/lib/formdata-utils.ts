export function createFormData(data: Record<string, any>) {
  const formData = new FormData()

  for (let key in data) {
    const value = data[key]

    if (value === null || value === undefined) {
      continue
    }

    formData.append(key, value)
  }

  return formData
}
