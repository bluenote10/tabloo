import vandom
import vandom/dom
import vandom/js_utils

bundleModules([
  "../node_modules/axios/dist/axios.js",
])

import widget_table


proc run(unit: Unit) =
  echo "Mounting main unit"
  unit.activate()
  let node = unit.domNode
  let root = document.getElementById("ROOT")
  root.appendChild(node)
  unit.setFocus()


let mainWidget = WidgetTable.init()
run(mainWidget)
