import { createRoot, createState, createEffect, onCleanup, sample } from 'solid-js';

import { StoreInterface, DataFetchOptions, TableData, ColumnData } from "./store";
import { Dropdown } from "./Dropdown";

import * as leaflet from "leaflet";


function MapWrapper(props: {
    mapData?: any,
  }) {

  let el: HTMLDivElement = null!;
  let map: leaflet.Map | undefined = undefined;
  let layerGroup: leaflet.LayerGroup | undefined = undefined;

  const [state, setState] = createState({
    mounted: false,
    cachedMapData: null,
  })

  let updateMap = (mapData: any) => {
    if (map == null) {
      console.log("Init map", el);
      map = leaflet.map(el, {preferCanvas: true}).fitWorld();
      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
    }

    if (layerGroup != undefined) {
      map.removeLayer(layerGroup);
    }

    let t1 = performance.now()
    try {
      let lines = [] as leaflet.Polyline[];
      for (let trajectory of mapData) {
        lines.push(leaflet.polyline(trajectory, {color: "red"}))
      }
      layerGroup = new leaflet.LayerGroup(lines);
      layerGroup.addTo(map);
    } catch {
      console.log("Invalid plot data");
    }
    let t2 = performance.now()
    console.log("Updated map took", (t2 - t1) / 1000);
  }

  createEffect(() => {
    // effect to monitor changes to props.mapData
    let newMapData = props.mapData;
    if (sample(() => state.mounted)) {
      // already mounted => we can call into the external lib directly
      updateMap(newMapData)
    } else {
      // not mounted => need to cache
      setState({cachedMapData: newMapData});
    }
  })

  let onMounted = () => {
    if (state.cachedMapData != null) {
      updateMap(state.cachedMapData!)
      setState({cachedMapData: null});
    }
    setState({mounted: true})
  }

  let onUnmounted = () => {
    setState({mounted: false})
  }

  return (
    <div
      ref={el}
      style="height:800px;"
      onconnected={onMounted}
      ondisconnected={onUnmounted}
    ></div>
  )
}


export function MapHandler(props: {
    store: StoreInterface,
    filter: string,
    onSetFilter: (s: string) => void,
  }) {

  const { store } = props

  const [state, setState] = createState({
    columns: [] as string[],
    mapData: {} as any,
    selectedCol: undefined! as number,
  })

  createEffect(() => {
    // handels updates of selected column indices
    let col = state.selectedCol;
    let filter = props.filter;
    if (col != undefined) {
      fetchData(col, filter);
    }
  })

  async function fetchColumns() {
    let columns = await store.fetchColumns()
    console.log(columns)
    setState({columns: columns})

    if (columns.length >= 1) {
      setState({
        selectedCol: 0,
      })
    }
  }

  async function fetchData(col: number, filter: string) {
    console.log(`Fetching data for column ${col}`)
    let data = await store.fetchData({
      sortKind: 0,
      filter: filter,
    })

    const numCols = data.length;
    if (numCols === 0) {
      console.log("WARNING: received data with 0 columns, ignoring...");
      return;
    }
    const numRows = data[0].values.length;

    // console.log(data);
    let coordinates = Array(numRows);
    for (let i=0; i<numRows; i++) {
      coordinates[i] = (data[col].values as any)[i]["coordinates"];
    }

    setState({mapData: coordinates as any})
  }

  fetchColumns()

  let inputFilter: HTMLInputElement | undefined

  function onFilterKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13 && inputFilter != undefined) {
      props.onSetFilter(inputFilter.value.trim())
    }
  }

  createEffect(() => {
    let newFilter = props.filter;
    console.log("MapHandler: filter updated to", newFilter);
    if (inputFilter != undefined) {
      inputFilter.value = newFilter;
    }
  })

  return (
    <div>
      <div class="ui-widget-header">
      <div class="ui-form-row">
        <span class="ui-form-label">Filter</span>
          <input
            class="input is-small ui-form-input"
            placeholder="Filter..."
            onkeydown={onFilterKeydown}
            ref={inputFilter}
          />
        </div>
        <div class="ui-form-row">
          <span class="ui-form-label">Column</span>
          <Dropdown
            items={(state.columns)}
            selectedIndex={(state.selectedCol)}
            cbSelect={(index: number) => setState({selectedCol: index})}
          />
        </div>
      </div>
      <MapWrapper mapData={(state.mapData)}/>
    </div>
  )
}