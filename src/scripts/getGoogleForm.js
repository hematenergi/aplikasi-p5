const { googleFormsToJson } = require("react-google-forms-hooks")
const fs = require("fs")
const path = require("path")

const saveJsonToFile = (filename, json) => {
  const filePath = path.resolve(__dirname, filename)
  fs.writeFile(filePath, JSON.stringify(json), "utf8", function (err) {
    if (err) throw err
  })
}

const FormList = [
  {
    label: "formP5",
    value: "1FAIpQLScxe5FGN4hMW8hFomPtQOUSPBoBfwIV9ereJtRCEfn5xhiKRw",
  },
  {
    label: "formAsesmenKelompok",
    value: "1FAIpQLSe-ItE7LLH_iXuGq-DP4q3gZmVWOpi1TQzAww1-Ew093U5BfA",
  },
]

const run = async () => {
  const formPromises = FormList.map(async ({ label, value }) => {
    const result = await googleFormsToJson(
      `https://docs.google.com/forms/d/e/${value}/viewform`
    )
    saveJsonToFile(`${label}.json`, result)
  })
  // const result = await googleFormsToJson(
  //   "https://docs.google.com/forms/d/e/1FAIpQLScxe5FGN4hMW8hFomPtQOUSPBoBfwIV9ereJtRCEfn5xhiKRw/viewform"
  // )
  // saveJsonToFile("form.json", result)

  await Promise.all(formPromises)
}

run()
