import { describe, expect, it } from "bun:test"
import { isPresetAdult } from "../is-preset-adult"

describe("isPresetAdult", () => {
  it("should return true for MAN_ADULT", () => {
    expect(isPresetAdult("MAN_ADULT")).toBe(true)
  })

  it("should return true for WOMAN_ADULT", () => {
    expect(isPresetAdult("WOMAN_ADULT")).toBe(true)
  })

  it("should return false for MAN_BABY", () => {
    expect(isPresetAdult("MAN_BABY")).toBe(false)
  })

  it("should return false for MAN_CHILD", () => {
    expect(isPresetAdult("MAN_CHILD")).toBe(false)
  })

  it("should return false for MAN_PRETEEN", () => {
    expect(isPresetAdult("MAN_PRETEEN")).toBe(false)
  })

  it("should return false for MAN_TEEN", () => {
    expect(isPresetAdult("MAN_TEEN")).toBe(false)
  })

  it("should return false for WOMAN_BABY", () => {
    expect(isPresetAdult("WOMAN_BABY")).toBe(false)
  })

  it("should return false for WOMAN_CHILD", () => {
    expect(isPresetAdult("WOMAN_CHILD")).toBe(false)
  })

  it("should return false for WOMAN_PRETEEN", () => {
    expect(isPresetAdult("WOMAN_PRETEEN")).toBe(false)
  })

  it("should return false for WOMAN_TEEN", () => {
    expect(isPresetAdult("WOMAN_TEEN")).toBe(false)
  })

  it("should return true for all adult presets", () => {
    expect(isPresetAdult("MAN_ADULT")).toBe(true)
    expect(isPresetAdult("WOMAN_ADULT")).toBe(true)
  })

  it("should return false for all non-adult presets", () => {
    expect(isPresetAdult("MAN_BABY")).toBe(false)
    expect(isPresetAdult("MAN_CHILD")).toBe(false)
    expect(isPresetAdult("MAN_PRETEEN")).toBe(false)
    expect(isPresetAdult("MAN_TEEN")).toBe(false)
    expect(isPresetAdult("WOMAN_BABY")).toBe(false)
    expect(isPresetAdult("WOMAN_CHILD")).toBe(false)
    expect(isPresetAdult("WOMAN_PRETEEN")).toBe(false)
    expect(isPresetAdult("WOMAN_TEEN")).toBe(false)
  })

  it("should return false for empty string", () => {
    expect(isPresetAdult("" as never)).toBe(false)
  })

  it("should return false for random strings", () => {
    expect(isPresetAdult("random" as never)).toBe(false)
    expect(isPresetAdult("ADULT" as never)).toBe(false)
    expect(isPresetAdult("adult" as never)).toBe(false)
    expect(isPresetAdult("MAN" as never)).toBe(false)
    expect(isPresetAdult("WOMAN" as never)).toBe(false)
  })

  it("should return false for lowercase variants", () => {
    expect(isPresetAdult("man_adult" as never)).toBe(false)
    expect(isPresetAdult("woman_adult" as never)).toBe(false)
    expect(isPresetAdult("Man_Adult" as never)).toBe(false)
    expect(isPresetAdult("Woman_Adult" as never)).toBe(false)
  })

  it("should return false for partial matches", () => {
    expect(isPresetAdult("MAN_ADUL" as never)).toBe(false)
    expect(isPresetAdult("WOMAN_ADUL" as never)).toBe(false)
    expect(isPresetAdult("MAN_ADULT_" as never)).toBe(false)
    expect(isPresetAdult("_MAN_ADULT" as never)).toBe(false)
  })

  it("should return false for whitespace variations", () => {
    expect(isPresetAdult(" MAN_ADULT" as never)).toBe(false)
    expect(isPresetAdult("MAN_ADULT " as never)).toBe(false)
    expect(isPresetAdult(" MAN_ADULT " as never)).toBe(false)
    expect(isPresetAdult("MAN ADULT" as never)).toBe(false)
  })

  it("should return false for null and undefined", () => {
    expect(isPresetAdult(null as never)).toBe(false)
    expect(isPresetAdult(undefined as never)).toBe(false)
  })

  it("should return false for non-string types", () => {
    expect(isPresetAdult(123 as never)).toBe(false)
    expect(isPresetAdult({} as never)).toBe(false)
    expect(isPresetAdult([] as never)).toBe(false)
    expect(isPresetAdult(true as never)).toBe(false)
  })
})
