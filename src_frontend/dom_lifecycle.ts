new MutationObserver(changes).observe(document, {
  subtree: true,
  childList: true,
});

export function changes(records: any) {
  for (var record, length = records.length, i = 0; i < length; i++) {
    record = records[i];
    dispatchAll(record.removedNodes, "disconnected");
    dispatchAll(record.addedNodes, "connected");
  }
}

export function dispatchAll(nodes: any, type: any) {
  for (
    var node, length = nodes.length, i = 0;
    i < length;
    (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, type)
  );
}

export function dispatchTarget(node: any, type: any) {
  node["on" + type] && node["on" + type]();
  node = node.firstChild;
  while (node) {
    dispatchTarget(node, type);
    node = node.nextSibling;
  }
}

declare global {
  namespace JSX {
    interface HTMLAttributes<T> {
      onconnected?: () => void
      ondisconnected?: () => void
    }
  }
}
