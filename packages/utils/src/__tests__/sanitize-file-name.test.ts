import { describe, expect, it } from "bun:test"
import { sanitizeFileName } from "../sanitize-file-name"

describe("sanitizeFileName", () => {
  it("should return unchanged for simple alphanumeric names", () => {
    expect(sanitizeFileName("photo.jpg")).toBe("photo.jpg")
    expect(sanitizeFileName("image123.png")).toBe("image123.png")
    expect(sanitizeFileName("MyFile.pdf")).toBe("MyFile.pdf")
  })

  it("should preserve underscores and hyphens in names", () => {
    expect(sanitizeFileName("my_file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my-file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my_photo-2024.png")).toBe("my_photo_2024.png")
  })

  it("should replace spaces with underscores", () => {
    expect(sanitizeFileName("my file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my photo name.png")).toBe("my_photo_name.png")
    expect(sanitizeFileName("file with spaces.pdf")).toBe(
      "file_with_spaces.pdf",
    )
  })

  it("should normalize accented characters", () => {
    expect(sanitizeFileName("café.jpg")).toBe("cafe.jpg")
    expect(sanitizeFileName("résumé.pdf")).toBe("resume.pdf")
    expect(sanitizeFileName("niño.png")).toBe("nino.png")
    expect(sanitizeFileName("naïve.jpg")).toBe("naive.jpg")
    expect(sanitizeFileName("Zürich.png")).toBe("Zurich.png")
    expect(sanitizeFileName("piñata.gif")).toBe("pinata.gif")
  })

  it("should handle various diacritical marks", () => {
    expect(sanitizeFileName("àáâãäå.jpg")).toBe("aaaaaa.jpg")
    expect(sanitizeFileName("èéêë.jpg")).toBe("eeee.jpg")
    expect(sanitizeFileName("ìíîï.jpg")).toBe("iiii.jpg")
    expect(sanitizeFileName("òóôõö.jpg")).toBe("ooooo.jpg")
    expect(sanitizeFileName("ùúûü.jpg")).toBe("uuuu.jpg")
    expect(sanitizeFileName("ýÿ.jpg")).toBe("yy.jpg")
    expect(sanitizeFileName("ñ.jpg")).toBe("n.jpg")
    expect(sanitizeFileName("ç.jpg")).toBe("c.jpg")
  })

  it("should remove unsafe URL characters", () => {
    expect(sanitizeFileName("file@name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file#name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file$name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file%name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file&name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file+name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file=name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file?name.jpg")).toBe("filename.jpg")
  })

  it("should remove special characters", () => {
    expect(sanitizeFileName("file!name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file'name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName('file"name.jpg')).toBe("filename.jpg")
    expect(sanitizeFileName("file(name).jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file[name].jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file{name}.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file<name>.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file|name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file\\name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file/name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file:name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file;name.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file*name.jpg")).toBe("filename.jpg")
  })

  it("should remove emojis", () => {
    expect(sanitizeFileName("photo😀.jpg")).toBe("photo.jpg")
    expect(sanitizeFileName("🎉party🎊.png")).toBe("party.png")
    expect(sanitizeFileName("❤️love❤️.gif")).toBe("love.gif")
    expect(sanitizeFileName("🌟star🌟.pdf")).toBe("star.pdf")
    expect(sanitizeFileName("👍thumbs👍up👍.jpg")).toBe("thumbsup.jpg")
  })

  it("should collapse multiple underscores into single underscore", () => {
    expect(sanitizeFileName("my__file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my___file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my____file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("a__b__c.png")).toBe("a_b_c.png")
  })

  it("should collapse multiple hyphens into single underscore", () => {
    expect(sanitizeFileName("my--file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my---file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("a--b--c.png")).toBe("a_b_c.png")
  })

  it("should collapse mixed underscores and hyphens", () => {
    expect(sanitizeFileName("my_-file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my-_file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my_-_file.jpg")).toBe("my_file.jpg")
    expect(sanitizeFileName("my-_-file.jpg")).toBe("my_file.jpg")
  })

  it("should trim leading underscores and hyphens", () => {
    expect(sanitizeFileName("_file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("__file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("-file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("--file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("_-file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("-_file.jpg")).toBe("file.jpg")
  })

  it("should trim trailing underscores and hyphens", () => {
    expect(sanitizeFileName("file_.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file__.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file-.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file--.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file_-.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file-_.jpg")).toBe("file.jpg")
  })

  it("should lowercase file extensions", () => {
    expect(sanitizeFileName("photo.JPG")).toBe("photo.jpg")
    expect(sanitizeFileName("photo.JPEG")).toBe("photo.jpeg")
    expect(sanitizeFileName("photo.PNG")).toBe("photo.png")
    expect(sanitizeFileName("photo.GIF")).toBe("photo.gif")
    expect(sanitizeFileName("document.PDF")).toBe("document.pdf")
    expect(sanitizeFileName("photo.JpG")).toBe("photo.jpg")
  })

  it("should preserve file extension", () => {
    expect(sanitizeFileName("file.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("file.jpeg")).toBe("file.jpeg")
    expect(sanitizeFileName("file.png")).toBe("file.png")
    expect(sanitizeFileName("file.gif")).toBe("file.gif")
    expect(sanitizeFileName("file.webp")).toBe("file.webp")
    expect(sanitizeFileName("file.pdf")).toBe("file.pdf")
    expect(sanitizeFileName("file.doc")).toBe("file.doc")
  })

  it("should handle files with multiple dots", () => {
    expect(sanitizeFileName("my.file.name.jpg")).toBe("myfilename.jpg")
    expect(sanitizeFileName("photo.2024.01.15.png")).toBe("photo20240115.png")
    expect(sanitizeFileName("file...name.jpg")).toBe("filename.jpg")
  })

  it("should fallback to 'file' when name becomes empty", () => {
    expect(sanitizeFileName(".jpg")).toBe("file.jpg")
    expect(sanitizeFileName("....jpg")).toBe("file.jpg")
    expect(sanitizeFileName("@#$%.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("😀😀😀.png")).toBe("file.png")
    expect(sanitizeFileName("_____.gif")).toBe("file.gif")
    expect(sanitizeFileName("-----.pdf")).toBe("file.pdf")
  })

  it("should handle files without extension", () => {
    expect(sanitizeFileName("myfile")).toBe("myfile")
    expect(sanitizeFileName("my file")).toBe("my_file")
    expect(sanitizeFileName("café")).toBe("cafe")
    expect(sanitizeFileName("résumé")).toBe("resume")
  })

  it("should handle empty string", () => {
    expect(sanitizeFileName("")).toBe("file")
  })

  it("should handle only special characters without extension", () => {
    expect(sanitizeFileName("@#$%")).toBe("file")
    expect(sanitizeFileName("😀😀😀")).toBe("file")
    expect(sanitizeFileName("!!!")).toBe("file")
  })

  it("should handle complex real-world file names", () => {
    expect(sanitizeFileName("Photo from café - été 2024!.jpg")).toBe(
      "Photo_from_cafe_ete_2024.jpg",
    )
    expect(sanitizeFileName("Résumé (Final Version).pdf")).toBe(
      "Resume_Final_Version.pdf",
    )
    expect(sanitizeFileName("Screenshot 2024-01-15 at 10.30.45.png")).toBe(
      "Screenshot_2024_01_15_at_103045.png",
    )
    expect(sanitizeFileName("Document #1 - Copy (2).docx")).toBe(
      "Document_1_Copy_2.docx",
    )
    expect(sanitizeFileName("Schöne Grüße!.jpg")).toBe("Schone_Grue.jpg")
  })

  it("should handle unicode characters beyond basic Latin", () => {
    expect(sanitizeFileName("文件.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("ファイル.png")).toBe("file.png")
    expect(sanitizeFileName("файл.gif")).toBe("file.gif")
    expect(sanitizeFileName("αρχείο.pdf")).toBe("file.pdf")
    expect(sanitizeFileName("mixed文件name.jpg")).toBe("mixedname.jpg")
  })

  it("should handle very long file names", () => {
    const longName = `${"a".repeat(100)}.jpg`
    expect(sanitizeFileName(longName)).toBe(longName)
  })

  it("should handle names with only numbers", () => {
    expect(sanitizeFileName("12345.jpg")).toBe("12345.jpg")
    expect(sanitizeFileName("2024.png")).toBe("2024.png")
    expect(sanitizeFileName("001.gif")).toBe("001.gif")
  })

  it("should handle hidden files (starting with dot)", () => {
    expect(sanitizeFileName(".hidden")).toBe("file.hidden")
    expect(sanitizeFileName(".gitignore")).toBe("file.gitignore")
  })

  it("should handle extension-only names with special chars", () => {
    expect(sanitizeFileName("@.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("_.jpg")).toBe("file.jpg")
    expect(sanitizeFileName("-.png")).toBe("file.png")
  })

  it("should handle names with tabs and newlines", () => {
    expect(sanitizeFileName("file\tname.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file\nname.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file\r\nname.jpg")).toBe("filename.jpg")
  })

  it("should handle names with zero-width characters", () => {
    expect(sanitizeFileName("file\u200Bname.jpg")).toBe("filename.jpg")
    expect(sanitizeFileName("file\uFEFFname.jpg")).toBe("filename.jpg")
  })
})
