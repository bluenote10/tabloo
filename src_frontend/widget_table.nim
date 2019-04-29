import oop_utils/standard_class

import vandom
import vandom/dom
import vandom/js_utils

import vandom/jsmod_axios
import jsffi


type
  TableData = JDict[cstring, JSeq[JsObject]]

type
  WidgetTableUnits = ref object
    main: Element
    tableHeader: Container
    tableBody: Container


class(WidgetTable of Widget):
  ctor proc() =
    var units = WidgetTableUnits()

    unitDefs: discard
      ep.tag("table").classes("table").container([
        ep.tag("thead").container([
          ep.tag("tr").container([]) as units.tableHeader
        ]),
        ep.tag("tbody").container([]) as units.tableBody
      ]) as units.main

    self:
      base(units.main)
      units

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
