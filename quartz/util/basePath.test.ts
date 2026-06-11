import test, { describe } from "node:test"
import assert from "node:assert"
import { baseHrefForPage } from "./basePath"
import type { GlobalConfiguration } from "../cfg"

describe("baseHrefForPage", () => {
  test("uses the configured baseUrl pathname for static 404 pages", () => {
    const cfg = { baseUrl: "example.com/quartz" } as GlobalConfiguration

    assert.equal(baseHrefForPage(cfg, "404", false), "/quartz/")
  })

  test("uses root for static 404 pages without a baseUrl subpath", () => {
    const cfg = { baseUrl: "example.com" } as GlobalConfiguration

    assert.equal(baseHrefForPage(cfg, "404", false), "/")
  })

  test("uses root for served 404 pages", () => {
    const cfg = { baseUrl: "example.com/quartz" } as GlobalConfiguration

    assert.equal(baseHrefForPage(cfg, "404", true), "/")
  })

  test("omits the base element for non-404 pages", () => {
    const cfg = { baseUrl: "example.com/quartz" } as GlobalConfiguration

    assert.equal(baseHrefForPage(cfg, "features/search", false), undefined)
  })
})
