import { describe, expect, it } from "bun:test"
import { getInitials } from "../get-initials"

describe("getInitials", () => {
  it("should return initials for a two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD")
  })

  it("should return first and last initials for a three-word name", () => {
    expect(getInitials("John Michael Doe")).toBe("JD")
  })

  it("should return single initial for a single name", () => {
    expect(getInitials("John")).toBe("J")
  })

  it("should uppercase lowercase names", () => {
    expect(getInitials("john doe")).toBe("JD")
    expect(getInitials("john")).toBe("J")
    expect(getInitials("john michael doe")).toBe("JD")
  })

  it("should handle mixed case names", () => {
    expect(getInitials("jOHN dOE")).toBe("JD")
    expect(getInitials("JOHN DOE")).toBe("JD")
  })

  it("should return 'X' for empty string", () => {
    expect(getInitials("")).toBe("X")
  })

  it("should return 'X' for whitespace only", () => {
    expect(getInitials(" ")).toBe("X")
    expect(getInitials("   ")).toBe("X")
    expect(getInitials("\t")).toBe("X")
    expect(getInitials("\n")).toBe("X")
  })

  it("should handle leading and trailing whitespace", () => {
    expect(getInitials(" John Doe ")).toBe("JD")
    expect(getInitials("  John  ")).toBe("J")
    expect(getInitials("\tJohn Doe\n")).toBe("JD")
  })

  it("should handle multiple spaces between names", () => {
    expect(getInitials("John  Doe")).toBe("JD")
    expect(getInitials("John   Michael   Doe")).toBe("JD")
    expect(getInitials("John    Doe")).toBe("JD")
  })

  it("should return max 2 initials for names with many parts", () => {
    expect(getInitials("John Michael William Smith Jr")).toBe("JJ")
    expect(getInitials("A B C D E F")).toBe("AF")
  })

  it("should handle single character names", () => {
    expect(getInitials("J")).toBe("J")
    expect(getInitials("J D")).toBe("JD")
    expect(getInitials("a b c")).toBe("AC")
  })

  it("should handle names with special characters", () => {
    expect(getInitials("Jean-Pierre Dupont")).toBe("JD")
    expect(getInitials("Mary O'Brien")).toBe("MO")
    expect(getInitials("José García")).toBe("JG")
  })

  it("should handle names with numbers", () => {
    expect(getInitials("John Doe 3rd")).toBe("J3")
    expect(getInitials("Test User 123")).toBe("T1")
  })

  it("should handle accented characters", () => {
    expect(getInitials("Élodie Müller")).toBe("ÉM")
    expect(getInitials("Ñoño García")).toBe("ÑG")
    expect(getInitials("Åsa Björk")).toBe("ÅB")
  })

  it("should handle unicode characters", () => {
    expect(getInitials("田中 太郎")).toBe("田太")
    expect(getInitials("Иван Петров")).toBe("ИП")
  })

  it("should handle tabs and newlines as separators", () => {
    expect(getInitials("John\tDoe")).toBe("JD")
    expect(getInitials("John\nDoe")).toBe("JD")
    expect(getInitials("John\r\nDoe")).toBe("JD")
  })
})
