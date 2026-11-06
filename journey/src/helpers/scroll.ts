/** Ref callback that eases the element into view. */
export const scrollIntoViewSmoothly = (node: HTMLElement | null) => {
  node?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};
