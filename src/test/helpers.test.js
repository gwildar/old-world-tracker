import { describe, it, expect } from "vitest";
import { extractFlyMovement, resolveBaseMv } from "../helpers.js";

describe("extractFlyMovement", () => {
  it("returns fly value from Fly (N) special rule", () => {
    const unit = { specialRules: [{ displayName: "Fly (9)" }] };
    expect(extractFlyMovement(unit, null)).toBe(9);
  });

  it("falls back to mount.f when no fly rule", () => {
    const unit = { specialRules: [] };
    expect(extractFlyMovement(unit, { f: 12 })).toBe(12);
  });

  it("returns null when no fly at all", () => {
    const unit = { specialRules: [] };
    expect(extractFlyMovement(unit, null)).toBeNull();
  });
});

describe("resolveBaseMv", () => {
  it("uses mountData.m when mount present", () => {
    expect(resolveBaseMv({ m: 8 }, "4")).toBe(8);
  });

  it("uses mv when no mount", () => {
    expect(resolveBaseMv(null, "6")).toBe(6);
  });

  it("returns null when neither available", () => {
    expect(resolveBaseMv(null, null)).toBeNull();
  });
});
