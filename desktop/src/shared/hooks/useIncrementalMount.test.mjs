import assert from "node:assert/strict";
import test from "node:test";

import { countGroupedRows, sliceGroupedRows } from "./useIncrementalMount.ts";

function group(id, rowCount) {
  return { id, rows: Array.from({ length: rowCount }, (_, i) => `${id}-${i}`) };
}

test("sliceGroupedRows trims across group boundaries in order", () => {
  const groups = [group("a", 3), group("b", 4), group("c", 2)];

  assert.deepEqual(
    sliceGroupedRows(groups, 5).map((g) => [g.id, g.rows.length]),
    [
      ["a", 3],
      ["b", 2],
    ],
  );
});

test("sliceGroupedRows keeps whole groups untouched when under budget", () => {
  const groups = [group("a", 3), group("b", 4)];
  const sliced = sliceGroupedRows(groups, 10);
  assert.equal(sliced.length, 2);
  // Fully-included groups keep their identity (no needless clones).
  assert.equal(sliced[0], groups[0]);
  assert.equal(sliced[1], groups[1]);
});

test("sliceGroupedRows with zero budget is empty; counts add up", () => {
  const groups = [group("a", 3), group("b", 4)];
  assert.deepEqual(sliceGroupedRows(groups, 0), []);
  assert.equal(countGroupedRows(groups), 7);
});
