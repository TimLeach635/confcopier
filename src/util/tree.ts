export interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

export interface Tree<T> {
  root: TreeNode<T>;
}

export const populateChildren = <T>(
  rootNode: TreeNode<T>,
  options: T[],
  isParent: (potentialParent: T, potentialChild: T) => boolean
): void => {
  for (let option of options) {
    if (isParent(rootNode.value, option) && !rootNode.children.some(child => child.value === option)) {
      const newChild: TreeNode<T> = {
        value: option,
        children: [],
      };
      populateChildren(newChild, options, isParent);
      rootNode.children.push(newChild);
    }
  }
}

export const makeTrees = <T>(
  items: T[],
  isParent: (potentialParent: T, potentialChild: T) => boolean
): Tree<T>[] => {
  // find the items without parents
  const roots: T[] = items
    .filter(item => {
      return !items.some(testItem => isParent(testItem, item));
    });

  // begin trees
  const trees: Tree<T>[] = roots.map(
    root => ({
      root: {
        value: root,
        children: [],
      },
    })
  );

  // add children
  for (let tree of trees) {
    populateChildren(tree.root, items, isParent);
  }

  return trees;
}

export const traverseTree = <T, U>(
  root: TreeNode<T>,
  fn: (nodeValue: T, prevOutput?: U) => U,
  input?: U
): TreeNode<U> => {
  let rootResult: U;

  if (input !== undefined) {
    rootResult = fn(root.value, input);
  } else {
    rootResult = fn(root.value);
  }

  const result: TreeNode<U> = {
    value: rootResult,
    children: []
  };

  for (let child of root.children) {
    result.children.push(traverseTree(child, fn, rootResult));
  }

  return result;
}

export const traversePromiseTree = async <T, U>(
  root: TreeNode<T>,
  fn: (nodeValue: T, prevOutput?: U) => Promise<U>,
  input?: U
): Promise<TreeNode<U>> => {
  let rootResult: U;

  if (input !== undefined) {
    rootResult = await fn(root.value, input);
  } else {
    rootResult = await fn(root.value);
  }

  const result: TreeNode<U> = {
    value: rootResult,
    children: []
  };

  for (let child of root.children) {
    result.children.push(await traversePromiseTree(child, fn, rootResult));
  }

  return result;
}

export const flatten = <T>(tree: TreeNode<T>): T[] => {
  const result: T[] = [tree.value];
  [tree.value].push(...tree.children.flatMap(flatten));

  return result;
}

export const visualiseNode = <T>(
  tree: TreeNode<T>,
  display: (item: T) => string,
  startPrefix: string,
  continuePrefix: string
): void => {
  console.log(`${startPrefix}${display(tree.value)}`);
  for (let i = 0; i < tree.children.length; i++) {
    const childNode = tree.children[i];

    if (i !== tree.children.length - 1) {
      visualiseNode(childNode, display, `${continuePrefix}├───`, `${continuePrefix}│   `);
    } else {
      visualiseNode(childNode, display, `${continuePrefix}└───`, `${continuePrefix}    `);
    }
  }
}

export const visualiseTreeArray = <T>(
  trees: Tree<T>[],
  display: (item: T) => string
): void => {
  const maxNDigits = Math.floor(Math.log10(trees.length)) + 1;
  trees.forEach((tree, index) => {
    visualiseNode(
      tree.root,
      display,
      `${index + 1}: `.padStart(maxNDigits + 2, " "),
      `${index + 1}  `.padStart(maxNDigits + 2, " ")
    );
  });
}
