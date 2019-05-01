import vandom
import vandom/dom
import vandom/js_utils
import jsffi

import ../widget_table


proc run(unit: Unit) =
  echo "Mounting main unit"
  unit.activate()
  let node = unit.domNode
  let root = document.getElementById("ROOT")
  root.appendChild(node)
  unit.setFocus()

import vandom/dom_utils

let table = WidgetTable[int, int].init()

setTimeout(100) do:
  echo "test"
  let data = TableData(
    colNames: newJSeq(cstring"a", cstring"b"),
    colData: newJDict({
      cstring"a": newJSeq(1, 2, 3).toJsElements,
      cstring"a": newJSeq(2, 4, 6).toJsElements,
    })
  )
  table.setData(data)

run(table)
