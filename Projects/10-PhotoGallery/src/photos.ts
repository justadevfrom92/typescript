// The typed core: data shape, guard and URL builders. The UI in App.jsx stays plain JavaScript.
import { hasShape, isArrayOf, isNumber, isString } from "#shared/guards.js";

export type Photo = { id: string; author: string; width: number; height: number; url: string; download_url: string };

export const isPhotoList = isArrayOf(
  hasShape<Photo>({ id: isString, author: isString, width: isNumber, height: isNumber, url: isString, download_url: isString }),
);

export const PER_PAGE = 12;

export function listUrl(page: number): string {
  return `https://picsum.photos/v2/list?page=${page}&limit=${PER_PAGE}`;
}

/** Picsum resizes on the fly: /id/{id}/{width}/{height} */
export function imageUrl(photo: Pick<Photo, "id">, width: number, height = Math.round((width * 2) / 3)): string {
  return `https://picsum.photos/id/${encodeURIComponent(photo.id)}/${width}/${height}`;
}

export function aspectRatio(photo: Pick<Photo, "width" | "height">): string {
  return `${photo.width} / ${photo.height}`;
}

export function wrapIndex(index: number, length: number): number {
  return length === 0 ? 0 : ((index % length) + length) % length;
}
