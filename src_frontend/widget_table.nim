import sugar
import sequtils

import oop_utils/standard_class

import vandom
import vandom/dom
import vandom/js_utils

#import vandom/jsmod_axios
#import jsffi


type
  #TableData* = ref object
  #  colNames*: JSeq[cstring]
  #  colData*: JDict[cstring, JSeq[cstring]]
  TableCol = ref object
    key: cstring
    name: cstring
    values: seq[cstring]
  TableData* = seq[TableCol]

  #[
  # Maybe later we switch to explicit types -- more flexible, but memory overhead...
  ColumnDesc* = ref object
    name: cstring
  CellDesc* = ref object
    value: cstring
  ]#


type
  WidgetTableUnits = ref object
    main: Element
    tableHeader: Container
    tableBody: Container
    renderHeader: cstring -> Element
    renderCell: cstring -> Element


proc defaultTableUnits(): WidgetTableUnits =
  var units = WidgetTableUnits()

  unitDefs: discard
    ep.tag("table").classes("table").container([
      ep.tag("thead").container([
        ep.tag("tr").container([]) as units.tableHeader
      ]),
      ep.tag("tbody").container([]) as units.tableBody
    ]) as units.main

  unitDefs:
    units.renderHeader = proc(s: cstring): Element =
      ep.tag("th").text(s)

    units.renderCell = proc(s: cstring): Element =
      ep.tag("td").text(s)

  units


class(WidgetTable of Widget):
  ctor proc(units = defaultTableUnits()) =

    self:
      base(units.main)
      units: WidgetTableUnits = units
      oldTableData = newSeq[TableColumn]()

  proc setData*(data: TableData) =
    debug(data)

    #[
    self.units.tableHeader.replaceChildren(
      data.colNames.mapIt(self.units.renderHeader(it).Unit)
    )

    var maxLen = 0
    for k, v in data.colData:
      if v.len > maxLen:
        maxLen = v.len
    echo maxLen
    ]#

    #self.units.tableBody.replaceChildren(
    #  newSeqWith
    #)



#[
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
]#

