import vandom
import vandom/dom
import vandom/js_utils

bundleModules([
  "../node_modules/axios/dist/axios.js",
])

import vandom/jsmod_axios
import jsffi


let req = axios.get("http://localhost:5000/api/get_data", JsObject{
    params: JsObject{
      ID: 12345
    }
  })
  .then(proc (response: JsObject) =
    echo "Received response..."
    debug(response.data)
  )
  .catch(proc (error: JsObject) =
    echo "error:"
    debug(error)
  )
  .then(proc () =
    echo "finally"
  )


proc run(unit: Unit) =
  echo "Mounting main unit"
  unit.activate()
  let node = unit.domNode
  let root = document.getElementById("ROOT")
  root.appendChild(node)
  unit.setFocus()


unitDefs:
  let mainUnit = ep.container([
    ep.tag("div").text("Hello world"),
  ])

run(mainUnit)
