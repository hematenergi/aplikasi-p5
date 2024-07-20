export const getIdByLabelIncludes = (data, searchString) => {
  const result = data.filter((item) => item.label.includes(searchString))
  return result.map((item) => item.id)
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const convertToTitleCase = (str) => {
  // Remove leading slashes
  str = str.replace(/^\//, "")

  // Split the string by hyphens
  let words = str.split("-")

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }

  // Join the words with spaces
  return words.join(" ")
}

export const openInstagram = (username) => {
  const url = `https://www.instagram.com/${username}/`
  window.open(url, "_blank")
}
