import * as leaflet from "leaflet";

// Experiment inspired by:
// http://bl.ocks.org/Sumbera/c6fed35c377a46ff74c3

// CanvasOverlad from here:
// https://github.com/Sumbera/gLayers.Leaflet/blob/master/L.CanvasLayer.js

/*
  Generic  Canvas Layer for leaflet 0.7 and 1.0-rc, 1.2, 1.3
  copyright Stanislav Sumbera,  2016-2018, sumbera.com , license MIT
  originally created and motivated by leaflet.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288

  also thanks to contributors: heyyeyheman,andern,nikiv3, anyoneelse ?
  enjoy !
*/

// -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
//------------------------------------------------------------------------------
leaflet.DomUtil.setTransform = leaflet.DomUtil.setTransform || function (el, offset, scale) {
  var pos = offset || new leaflet.Point(0, 0);

  el.style[leaflet.DomUtil.TRANSFORM as any] =
      (leaflet.Browser.ie3d ?
          'translate(' + pos.x + 'px,' + pos.y + 'px)' :
          'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
      (scale ? ' scale(' + scale + ')' : '');
};

// -- support for both  0.0.7 and 1.0.0 rc2 leaflet
const CanvasLayer = (leaflet.Layer ? leaflet.Layer : leaflet.Class).extend({
  // -- initialized is called on prototype
  initialize: function (options: any) {
      this._map    = null;
      this._canvas = null;
      this._frame  = null;
      this._delegate = null;
      (leaflet as any).setOptions(this, options);
  },

  delegate :function(del: any){
      this._delegate = del;
      return this;
  },

  needRedraw: function () {
      if (!this._frame) {
          this._frame = leaflet.Util.requestAnimFrame(this.drawLayer, this);
      }
      return this;
  },

  //-------------------------------------------------------------
  _onLayerDidResize: function (resizeEvent: any) {
      this._canvas.width = resizeEvent.newSize.x;
      this._canvas.height = resizeEvent.newSize.y;
  },
  //-------------------------------------------------------------
  _onLayerDidMove: function () {
      var topLeft = this._map.containerPointToLayerPoint([0, 0]);
      leaflet.DomUtil.setPosition(this._canvas, topLeft);
      this.drawLayer();
  },
  //-------------------------------------------------------------
  getEvents: function () {
      var events = {
          resize: this._onLayerDidResize,
          moveend: this._onLayerDidMove,
          zoom: this._onLayerDidMove
      };
      if (this._map.options.zoomAnimation && leaflet.Browser.any3d) {
          (events as any).zoomanim =  this._animateZoom;
      }

      return events;
  },
  //-------------------------------------------------------------
  onAdd: function (map: any) {
      this._map = map;
      this._canvas = leaflet.DomUtil.create('canvas', 'leaflet-layer');
      this.tiles = {};

      var size = this._map.getSize();
      this._canvas.width = size.x;
      this._canvas.height = size.y;

      var animated = this._map.options.zoomAnimation && leaflet.Browser.any3d;
      leaflet.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


      map._panes.overlayPane.appendChild(this._canvas);

      map.on(this.getEvents(),this);

      var del = this._delegate || this;
      del.onLayerDidMount && del.onLayerDidMount(); // -- callback
      this.needRedraw();
  },

  //-------------------------------------------------------------
  onRemove: function (map: any) {
      var del = this._delegate || this;
      del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

      if (this._frame) {
          leaflet.Util.cancelAnimFrame(this._frame);
      }

      map.getPanes().overlayPane.removeChild(this._canvas);

      map.off(this.getEvents(),this);

      this._canvas = null;

  },

  //------------------------------------------------------------
  addTo: function (map: any) {
      map.addLayer(this);
      return this;
  },
  // --------------------------------------------------------------------------------
  LatLonToMercator: function (latlon: any) {
      return {
          x: latlon.lng * 6378137 * Math.PI / 180,
          y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
      };
  },

  //------------------------------------------------------------------------------
  drawLayer: function () {
      // -- todo make the viewInfo properties  flat objects.
      var size   = this._map.getSize();
      var bounds = this._map.getBounds();
      var zoom   = this._map.getZoom();

      var center = this.LatLonToMercator(this._map.getCenter());
      var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

      var del = this._delegate || this;
      del.onDrawLayer && del.onDrawLayer( {
                                              layer : this,
                                              canvas: this._canvas,
                                              bounds: bounds,
                                              size: size,
                                              zoom: zoom,
                                              center : center,
                                              corner : corner
                                          });
      this._frame = null;
  },
  // -- leaflet.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
  //------------------------------------------------------------------------------
  _setTransform: function (el: any, offset: any, scale: any) {
      var pos = offset || new leaflet.Point(0, 0);

      el.style[leaflet.DomUtil.TRANSFORM] =
    (leaflet.Browser.ie3d ?
      'translate(' + pos.x + 'px,' + pos.y + 'px)' :
      'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
    (scale ? ' scale(' + scale + ')' : '');
  },

  //------------------------------------------------------------------------------
  _animateZoom: function (e: any) {
      var scale = this._map.getZoomScale(e.zoom);
      // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
      var offset = leaflet.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min :
                             this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

      leaflet.DomUtil.setTransform(this._canvas, offset, scale);


  }
});

const canvasLayer = function () {
  return new CanvasLayer();
};

// The above seems to be the successor of the original gist:
// https://gist.github.com/Sumbera/11114288
// https://gist.github.com/danwild/1ce9fb8891bf187450f882261730b4a8
// But since the API has changed (for the worse), let's stick with the original:

const CanvasOverlay = leaflet.Layer.extend({

  initialize: function (userDrawFunc: () => void, options: any) {
      this._userDrawFunc = userDrawFunc;
      //leaflet.setOptions(this, options);
  },

  drawing: function (userDrawFunc: () => void) {
      this._userDrawFunc = userDrawFunc;
      return this;
  },

  params: function(options: any){
      //L.setOptions(this, options);
      return this;
  },

  canvas: function () {
      return this._canvas;
  },

  redraw: function () {
      if (!this._frame) {
          this._frame = leaflet.Util.requestAnimFrame(this._redraw, this);
      }
      return this;
  },

  onAdd: function (map: leaflet.Map) {
      this._map = map;
      this._canvas = leaflet.DomUtil.create('canvas', 'leaflet-heatmap-layer');

      var size = this._map.getSize();
      this._canvas.width = size.x;
      this._canvas.height = size.y;

      var animated = this._map.options.zoomAnimation && leaflet.Browser.any3d;
      leaflet.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


      (map as any)._panes.overlayPane.appendChild(this._canvas);

      map.on('moveend', this._reset, this);
      map.on('resize',  this._resize, this);

      if (map.options.zoomAnimation && leaflet.Browser.any3d) {
          map.on('zoomanim', this._animateZoom, this);
      }

      this._reset();
  },

  onRemove: function (map: leaflet.Map) {
      map.getPanes().overlayPane.removeChild(this._canvas);

      map.off('moveend', this._reset, this);
      map.off('resize', this._resize, this);

      if (map.options.zoomAnimation) {
          map.off('zoomanim', this._animateZoom, this);
      }
      this._canvas = null;

  },

  addTo: function (map: leaflet.Map) {
      map.addLayer(this);
      return this;
  },

  _resize: function (resizeEvent: leaflet.ResizeEvent) {
      this._canvas.width  = resizeEvent.newSize.x;
      this._canvas.height = resizeEvent.newSize.y;
  },
  _reset: function () {
      var topLeft = this._map.containerPointToLayerPoint([0, 0]);
      leaflet.DomUtil.setPosition(this._canvas, topLeft);
      this._redraw();
  },

  _redraw: function () {
      var size     = this._map.getSize();
      var bounds   = this._map.getBounds();
      var zoomScale = (size.x * 180) / (20037508.34  * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
      var zoom = this._map.getZoom();

      // console.time('process');

      if (this._userDrawFunc) {
          this._userDrawFunc(this,
                              {
                                  canvas   :this._canvas,
                                  bounds   : bounds,
                                  size     : size,
                                  zoomScale: zoomScale,
                                  zoom : zoom,
                                  options: this.options
                             });
      }


      // console.timeEnd('process');

      this._frame = null;
  },

  /*
  _animateZoom: function (e: any) {
      var scale = this._map.getZoomScale(e.zoom),
          offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

      this._canvas.style[leaflet.DomUtil.TRANSFORM] = leaflet.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
  }
  */
 // animateZoom was relying on leaflet.DomUtil.getTranslateString which no longer exists.
 // replacing by the updated version from the new "CanvasLayer" repo...
 _animateZoom: function (e: any) {
    var scale = this._map.getZoomScale(e.zoom);
    // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1
    var offset = leaflet.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min :
                          this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

    leaflet.DomUtil.setTransform(this._canvas, offset, scale);
  }

});

const canvasOverlay = function (userDrawFunc?: () => void, options?: any) {
  return new (CanvasOverlay as any)(userDrawFunc, options);
};

let vshader = `
uniform mat4 u_matrix;
attribute vec4 a_vertex;
attribute float a_pointSize;
attribute vec4 a_color;
varying vec4 v_color;

void main() {
  // Set the size of the point
  gl_PointSize =  a_pointSize;

  // multiply each vertex by a matrix.
  gl_Position = u_matrix * a_vertex;


  // pass the color to the fragment shader
  v_color = a_color;
}`

let fshader = `
precision mediump float;
varying vec4 v_color;

void main() {

  float border = 0.05;
  float radius = 0.5;
  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 color1 = vec4(v_color[0], v_color[1], v_color[2], 0.2);

  vec2 m = gl_PointCoord.xy - vec2(0.5, 0.5);
  float dist = radius - sqrt(m.x * m.x + m.y * m.y);

  float t = 0.0;
  if (dist > border)
  t = 1.0;
  else if (dist > 0.0)
  t = dist / border;

  // float centerDist = length(gl_PointCoord - 0.5);
  // works for overlapping circles if blending is enabled

  gl_FragColor = mix(color0, color1, t);
}`

export function addLayerGL(leafletMap: leaflet.Map, data: number[][]) {

  var glLayer = canvasOverlay()
                 .drawing(drawingOnCanvas)
                 .addTo(leafletMap);

  console.log("Adding map layer of size", data.length)
  console.time("setup_gl")
  window.performance.mark("setup_gl_mark");

  var canvas = glLayer.canvas();

  glLayer.canvas.width = canvas.clientWidth;
  glLayer.canvas.height = canvas.clientHeight;

  //var gl = canvas.getContext('experimental-webgl', { antialias: true });
  var gl = canvas.getContext('webgl', { antialias: true });

  var pixelsToWebGLMatrix = new Float32Array(16);
  var mapMatrix = new Float32Array(16);

  // -- WebGl setup
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vshader);
  gl.compileShader(vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fshader);
  gl.compileShader(fragmentShader);

  // link shaders to create our program
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  //  gl.disable(gl.DEPTH_TEST);
  // ----------------------------
  // look up the locations for the inputs to our shaders.
  var u_matLoc = gl.getUniformLocation(program, "u_matrix");
  var colorLoc = gl.getAttribLocation(program, "a_color");
  var vertLoc = gl.getAttribLocation(program, "a_vertex");
  gl.aPointSize = gl.getAttribLocation(program, "a_pointSize");
  // Set the matrix to some that makes 1 unit 1 pixel.

  pixelsToWebGLMatrix.set([2 / canvas.width, 0, 0, 0, 0, -2 / canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.uniformMatrix4fv(u_matLoc, false, pixelsToWebGLMatrix);

  // -- data
  var verts = [] as number[];

  data.map(function (d, i) {
    let pixel = LatLongToPixelXY(d[0], d[1]);
    //-- 2 coord, 3 rgb colors interleaved buffer
    verts.push(pixel.x, pixel.y, Math.random(), Math.random(), Math.random());
  });

  var numPoints = data.length ;

  var vertBuffer = gl.createBuffer();
  var vertArray = new Float32Array(verts);
  var fsize = vertArray.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertLoc, 2, gl.FLOAT, false,fsize*5,0);
  gl.enableVertexAttribArray(vertLoc);
  // -- offset for color buffer
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, fsize*5, fsize*2);
  gl.enableVertexAttribArray(colorLoc);

  glLayer.redraw();
  console.timeEnd("setup_gl")
  window.performance.measure("setup_gl", "setup_gl_mark");


  function drawingOnCanvas(canvasOverlay: any, params: any) {
      if (gl == null) return;

      gl.clear(gl.COLOR_BUFFER_BIT);


      pixelsToWebGLMatrix.set([2 / canvas.width, 0, 0, 0, 0, -2 / canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
      gl.viewport(0, 0, canvas.width, canvas.height);



      var pointSize = Math.max(leafletMap.getZoom() - 4.0, 1.0);
      gl.vertexAttrib1f(gl.aPointSize, pointSize);

      // -- set base matrix to translate canvas pixel coordinates -> webgl coordinates
      mapMatrix.set(pixelsToWebGLMatrix);

      var bounds = leafletMap.getBounds();
      var topLeft = new leaflet.LatLng(bounds.getNorth(), bounds.getWest());
      var offset = LatLongToPixelXY(topLeft.lat, topLeft.lng);

      // -- Scale to current zoom
      var scale = Math.pow(2, leafletMap.getZoom());
      scaleMatrix(mapMatrix, scale, scale);

      translateMatrix(mapMatrix, -offset.x, -offset.y);

      // -- attach matrix value to 'mapMatrix' uniform in shader
      gl.uniformMatrix4fv(u_matLoc, false, mapMatrix);
      gl.drawArrays(gl.POINTS, 0, numPoints);

  }

  // Returns a random integer from 0 to range - 1.
  function randomInt(range: any) {
      return Math.floor(Math.random() * range);
  }

  /*
  function latlonToPixels(lat, lon) {
      initialResolution = 2 * Math.PI * 6378137 / 256, // at zoomlevel 0
      originShift = 2 * Math.PI * 6378137 / 2;

      // -- to meters
      var mx = lon * originShift / 180;
      var my = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      my = my * originShift / 180;


      // -- to pixels at zoom level 0

      var res = initialResolution;
      x = (mx + originShift) / res,
      y = (my + originShift) / res;


      return { x: x, y: 256- y };
  }
  */
  // -- converts latlon to pixels at zoom level 0 (for 256x256 tile size) , inverts y coord )
  // -- source : http://build-failed.blogspot.cz/2013/02/displaying-webgl-data-on-google-maps.html

  function LatLongToPixelXY(latitude: number, longitude: number) {
      var pi_180 = Math.PI / 180.0;
      var pi_4 = Math.PI * 4;
      var sinLatitude = Math.sin(latitude * pi_180);
      var pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
      var pixelX = ((longitude + 180) / 360) * 256;

      var pixel = { x: pixelX, y: pixelY };

      return pixel;
  }

  function translateMatrix(matrix: Float32Array, tx: number, ty: number) {
      // translation is in last column of matrix
      matrix[12] += matrix[0] * tx + matrix[4] * ty;
      matrix[13] += matrix[1] * tx + matrix[5] * ty;
      matrix[14] += matrix[2] * tx + matrix[6] * ty;
      matrix[15] += matrix[3] * tx + matrix[7] * ty;
  }

  function scaleMatrix(matrix: Float32Array, scaleX: number, scaleY: number) {
      // scaling x and y, which is just scaling first two columns of matrix
      matrix[0] *= scaleX;
      matrix[1] *= scaleX;
      matrix[2] *= scaleX;
      matrix[3] *= scaleX;

      matrix[4] *= scaleY;
      matrix[5] *= scaleY;
      matrix[6] *= scaleY;
      matrix[7] *= scaleY;
  }

}