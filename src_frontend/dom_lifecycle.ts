new MutationObserver(changes).observe(document, {
  subtree: true,
  childList: true
});

function changes(records: any) {
  for (var record, length = records.length, i = 0; i < length; i++) {
    record = records[i];
    dispatchAll(record.removedNodes, "disconnected");
    dispatchAll(record.addedNodes, "connected");
  }
}

function dispatchAll(nodes: any, type: any) {
  for (
    var node, length = nodes.length, i = 0;
    i < length;
    (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, type)
  );
}

function dispatchTarget(node: any, type: any) {
  node["on" + type] && node["on" + type]();
  node = node.firstChild;
  while (node) {
    dispatchTarget(node, type);
    node = node.nextSibling;
  }
}
