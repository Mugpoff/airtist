import { describe, expect, it } from "bun:test"
import { isPresetBaby } from "../is-preset-baby"

describe("isPresetBaby", () => {
  it("should return true for MAN_BABY", () => {
    expect(isPresetBaby("MAN_BABY")).toBe(true)
  })

  it("should return true for WOMAN_BABY", () => {
    expect(isPresetBaby("WOMAN_BABY")).toBe(true)
  })

  it("should return false for MAN_CHILD", () => {
    expect(isPresetBaby("MAN_CHILD")).toBe(false)
  })

  it("should return false for MAN_PRETEEN", () => {
    expect(isPresetBaby("MAN_PRETEEN")).toBe(false)
  })

  it("should return false for MAN_TEEN", () => {
    expect(isPresetBaby("MAN_TEEN")).toBe(false)
  })

  it("should return false for MAN_ADULT", () => {
    expect(isPresetBaby("MAN_ADULT")).toBe(false)
  })

  it("should return false for WOMAN_CHILD", () => {
    expect(isPresetBaby("WOMAN_CHILD")).toBe(false)
  })

  it("should return false for WOMAN_PRETEEN", () => {
    expect(isPresetBaby("WOMAN_PRETEEN")).toBe(false)
  })

  it("should return false for WOMAN_TEEN", () => {
    expect(isPresetBaby("WOMAN_TEEN")).toBe(false)
  })

  it("should return false for WOMAN_ADULT", () => {
    expect(isPresetBaby("WOMAN_ADULT")).toBe(false)
  })

  it("should return true for all baby presets", () => {
    expect(isPresetBaby("MAN_BABY")).toBe(true)
    expect(isPresetBaby("WOMAN_BABY")).toBe(true)
  })

  it("should return false for all non-baby presets", () => {
    expect(isPresetBaby("MAN_CHILD")).toBe(false)
    expect(isPresetBaby("MAN_PRETEEN")).toBe(false)
    expect(isPresetBaby("MAN_TEEN")).toBe(false)
    expect(isPresetBaby("MAN_ADULT")).toBe(false)
    expect(isPresetBaby("WOMAN_CHILD")).toBe(false)
    expect(isPresetBaby("WOMAN_PRETEEN")).toBe(false)
    expect(isPresetBaby("WOMAN_TEEN")).toBe(false)
    expect(isPresetBaby("WOMAN_ADULT")).toBe(false)
  })

  it("should return false for empty string", () => {
    expect(isPresetBaby("" as never)).toBe(false)
  })

  it("should return false for random strings", () => {
    expect(isPresetBaby("random" as never)).toBe(false)
    expect(isPresetBaby("BABY" as never)).toBe(false)
    expect(isPresetBaby("baby" as never)).toBe(false)
    expect(isPresetBaby("MAN" as never)).toBe(false)
    expect(isPresetBaby("WOMAN" as never)).toBe(false)
  })

  it("should return false for lowercase variants", () => {
    expect(isPresetBaby("man_baby" as never)).toBe(false)
    expect(isPresetBaby("woman_baby" as never)).toBe(false)
    expect(isPresetBaby("Man_Baby" as never)).toBe(false)
    expect(isPresetBaby("Woman_Baby" as never)).toBe(false)
  })

  it("should return false for partial matches", () => {
    expect(isPresetBaby("MAN_BAB" as never)).toBe(false)
    expect(isPresetBaby("WOMAN_BAB" as never)).toBe(false)
    expect(isPresetBaby("MAN_BABY_" as never)).toBe(false)
    expect(isPresetBaby("_MAN_BABY" as never)).toBe(false)
  })

  it("should return false for whitespace variations", () => {
    expect(isPresetBaby(" MAN_BABY" as never)).toBe(false)
    expect(isPresetBaby("MAN_BABY " as never)).toBe(false)
    expect(isPresetBaby(" MAN_BABY " as never)).toBe(false)
    expect(isPresetBaby("MAN BABY" as never)).toBe(false)
  })

  it("should return false for null and undefined", () => {
    expect(isPresetBaby(null as never)).toBe(false)
    expect(isPresetBaby(undefined as never)).toBe(false)
  })

  it("should return false for non-string types", () => {
    expect(isPresetBaby(123 as never)).toBe(false)
    expect(isPresetBaby({} as never)).toBe(false)
    expect(isPresetBaby([] as never)).toBe(false)
    expect(isPresetBaby(true as never)).toBe(false)
  })
})
