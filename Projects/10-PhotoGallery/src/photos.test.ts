import { test } from "node:test";
import assert from "node:assert/strict";
import { aspectRatio, imageUrl, isPhotoList, listUrl, wrapIndex } from "./photos.js";

test("urls", () => {
  assert.equal(listUrl(2), "https://picsum.photos/v2/list?page=2&limit=12");
  assert.equal(imageUrl({ id: "10" }, 300), "https://picsum.photos/id/10/300/200");
});

test("guard rejects malformed lists", () => {
  const photo = { id: "0", author: "A", width: 10, height: 5, url: "u", download_url: "d" };
  assert.equal(isPhotoList([photo]), true);
  assert.equal(isPhotoList([{ ...photo, id: 0 }]), false);
});

test("wrapIndex cycles in both directions", () => {
  assert.equal(wrapIndex(-1, 3), 2);
  assert.equal(wrapIndex(3, 3), 0);
  assert.equal(wrapIndex(1, 0), 0);
  assert.equal(aspectRatio({ width: 4, height: 3 }), "4 / 3");
});
