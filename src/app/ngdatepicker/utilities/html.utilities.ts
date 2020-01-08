export const isChildOf = (parent: HTMLElement, child: HTMLElement): boolean => {
  let node: HTMLElement = child;

  while (node) {
    if (node === parent) {
      return true;
    }

    node = node.parentElement;
  }

  return false;
};
