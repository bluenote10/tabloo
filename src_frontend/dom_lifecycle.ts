new MutationObserver(mutationCallback).observe(document, {
  subtree: true,
  childList: true,
});

export function mutationCallback(records: MutationRecord[]) {
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    dispatchAll(record.removedNodes, "disconnected");
    dispatchAll(record.addedNodes, "connected");
  }
}

export function dispatchAll(nodes: NodeList, type: "disconnected" | "connected") {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    node.nodeType === 1 && dispatchTarget(node, type);
  }
}

export function dispatchTarget(node: any, type: "disconnected" | "connected") {
  node["on" + type] && node["on" + type]();
  node = node.firstChild;
  while (node) {
    dispatchTarget(node, type);
    node = node.nextSibling;
  }
}

/*
// Solid doesn't seem to auto-attach these callbacks to the node anymore,
// therefore this currently doesn't work, and manual attach is required.
declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> {
      onconnected?: () => void;
      ondisconnected?: () => void;
    }
  }
}
*/
