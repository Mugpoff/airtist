import { describe, expect, it } from "bun:test"
import { parseLocale } from "../parse-locale"

describe("parseLocale", () => {
  it("should return cookie locale when cookie is valid 'en'", () => {
    expect(parseLocale("en", null)).toBe("en")
  })

  it("should return cookie locale when cookie is valid 'fr'", () => {
    expect(parseLocale("fr", null)).toBe("fr")
  })

  it("should return header locale when cookie is null and header is 'en'", () => {
    expect(parseLocale(null, "en")).toBe("en")
  })

  it("should return header locale when cookie is null and header is 'fr'", () => {
    expect(parseLocale(null, "fr")).toBe("fr")
  })

  it("should prioritize cookie over header", () => {
    expect(parseLocale("fr", "en")).toBe("fr")
    expect(parseLocale("en", "fr")).toBe("en")
  })

  it("should return default locale 'en' when both cookie and header are null", () => {
    expect(parseLocale(null, null)).toBe("en")
  })

  it("should return header locale when cookie is invalid", () => {
    expect(parseLocale("invalid", "fr")).toBe("fr")
    expect(parseLocale("de", "en")).toBe("en")
  })

  it("should return default locale when cookie is invalid and header is null", () => {
    expect(parseLocale("invalid", null)).toBe("en")
    expect(parseLocale("de", null)).toBe("en")
  })

  it("should return default locale when cookie is invalid and header is invalid", () => {
    expect(parseLocale("invalid", "invalid")).toBe("en")
    expect(parseLocale("de", "es")).toBe("en")
  })

  it("should parse Accept-Language header format", () => {
    expect(parseLocale(null, "fr-FR,fr;q=0.9,en;q=0.8")).toBe("fr")
    expect(parseLocale(null, "en-US,en;q=0.9")).toBe("en")
  })

  it("should handle Accept-Language header with quality values", () => {
    expect(parseLocale(null, "en;q=0.8,fr;q=0.9")).toBe("fr")
    expect(parseLocale(null, "fr;q=0.5,en;q=0.9")).toBe("en")
  })

  it("should handle Accept-Language header with unsupported locales", () => {
    expect(parseLocale(null, "de-DE,de;q=0.9")).toBe("en")
    expect(parseLocale(null, "es,it,pt")).toBe("en")
  })

  it("should handle Accept-Language header with mixed supported and unsupported", () => {
    expect(parseLocale(null, "de-DE,fr;q=0.8")).toBe("fr")
    expect(parseLocale(null, "es,en;q=0.5")).toBe("en")
  })

  it("should return default locale for empty string cookie", () => {
    expect(parseLocale("", null)).toBe("en")
    expect(parseLocale("", "fr")).toBe("fr")
  })

  it("should return default locale for empty string header", () => {
    expect(parseLocale(null, "")).toBe("en")
  })

  it("should return default locale when both are empty strings", () => {
    expect(parseLocale("", "")).toBe("en")
  })

  it("should be case insensitive for header parsing (loose mode)", () => {
    expect(parseLocale(null, "EN")).toBe("en")
    expect(parseLocale(null, "FR")).toBe("fr")
    expect(parseLocale(null, "En-Us")).toBe("en")
    expect(parseLocale(null, "Fr-Fr")).toBe("fr")
  })

  it("should not accept case variants for cookie (strict zod parsing)", () => {
    expect(parseLocale("EN", null)).toBe("en")
    expect(parseLocale("FR", null)).toBe("en")
    expect(parseLocale("En", null)).toBe("en")
  })

  it("should handle whitespace in cookie", () => {
    expect(parseLocale(" en", null)).toBe("en")
    expect(parseLocale("en ", null)).toBe("en")
    expect(parseLocale(" en ", null)).toBe("en")
  })

  it("should handle complex Accept-Language headers", () => {
    expect(parseLocale(null, "fr-CA,fr;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("fr")
    expect(parseLocale(null, "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7")).toBe("en")
  })

  it("should handle wildcard in Accept-Language header", () => {
    expect(parseLocale(null, "*")).toBe("en")
    expect(parseLocale(null, "*;q=0.5,fr;q=0.9")).toBe("fr")
  })
})
