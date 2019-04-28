import oop_utils/standard_class

import vandom
import vandom/dom
import vandom/js_utils

import vandom/jsmod_axios
import jsffi


type
  TableData = JDict[cstring, JSeq[JsObject]]


class(WidgetTable of Widget):
  ctor proc() =
    unitDefs:
      let container = ep.container([])

    self:
      base(container)
      container

    let req = axios.get("http://localhost:5000/api/get_data", JsObject{
        params: JsObject{
          ID: 12345
        }
      })
      .then(proc (response: JsObject) =
        echo "Received response..."
        let tableData = response.data.to(TableData)
        self.updateData(tableData)
      )
      .catch(proc (error: JsObject) =
        echo "error:"
        debug(error)
      )
      .then(proc () =
        echo "finally"
      )


  proc updateData(data: TableData) =
    var maxLen = 0
    debug(data)
    let columns = data.keys()
    for k, v in data:
      if v.len > maxLen:
        maxLen = v.len
    echo maxLen
