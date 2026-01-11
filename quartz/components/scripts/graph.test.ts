import test, { describe } from "node:test"
import assert from "node:assert"
import { zoomIdentity } from "d3"

describe("graph", () => {
  describe("defaultZoom", () => {
    test("should create identity transform when not specified", () => {
      const transform = zoomIdentity
      assert.strictEqual(transform.k, 1)
      assert.strictEqual(transform.x, 0)
      assert.strictEqual(transform.y, 0)
    })

    test("should scale correctly when defaultZoom is 2", () => {
      const width = 400
      const height = 300
      const defaultZoom = 2

      const transform = zoomIdentity
        .translate(width / 2, height / 2)
        .scale(defaultZoom)
        .translate(-width / 2, -height / 2)

      assert.strictEqual(transform.k, defaultZoom)
      assert.strictEqual(transform.x, -200)
      assert.strictEqual(transform.y, -150)
    })

    test("should produce identity-like transform when defaultZoom is 1", () => {
      const width = 400
      const height = 300
      const defaultZoom = 1

      const transform = zoomIdentity
        .translate(width / 2, height / 2)
        .scale(defaultZoom)
        .translate(-width / 2, -height / 2)

      assert.strictEqual(transform.k, 1)
      assert.strictEqual(transform.x, 0)
      assert.strictEqual(transform.y, 0)
    })

    test("should zoom out when defaultZoom is 0.5", () => {
      const width = 400
      const height = 300
      const defaultZoom = 0.5

      const transform = zoomIdentity
        .translate(width / 2, height / 2)
        .scale(defaultZoom)
        .translate(-width / 2, -height / 2)

      assert.strictEqual(transform.k, 0.5)
      assert.strictEqual(transform.x, 100)
      assert.strictEqual(transform.y, 75)
    })

    test("should keep center point stationary after zoom", () => {
      const width = 400
      const height = 300
      const defaultZoom = 2

      const transform = zoomIdentity
        .translate(width / 2, height / 2)
        .scale(defaultZoom)
        .translate(-width / 2, -height / 2)

      const centerX = width / 2
      const centerY = height / 2
      const [newX, newY] = transform.apply([centerX, centerY])

      assert.strictEqual(newX, centerX)
      assert.strictEqual(newY, centerY)
    })

    test("should default to 1 when defaultZoom is undefined", () => {
      const defaultZoom: number | undefined = undefined
      const zoomLevel = defaultZoom ?? 1

      assert.strictEqual(zoomLevel, 1)
    })

    test("should use provided value when defaultZoom is defined", () => {
      const defaultZoom: number | undefined = 2.5
      const zoomLevel = defaultZoom ?? 1

      assert.strictEqual(zoomLevel, 2.5)
    })
  })
})
