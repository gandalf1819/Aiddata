var urls = {
    // source: https://observablehq.com/@mbostock/u-s-aids-voronoi
    // source: https://github.com/topojson/us-atlas
    map: "https://unpkg.com/us-atlas@1/us/10m.json",
  
    // Change URL to csv uploaded on github
    // source: https://gist.github.com/mbostock/7608400
    aids:
      "https://raw.githubusercontent.com/gandalf1819/Aiddata/master/Mini-Project-1/Viz-2/aiddata.csv",
    // aids:
    //   "https://gist.githubusercontent.com/mbostock/7608400/raw/e5974d9bba45bc9ab272d98dd7427567aafd55bc/aids.csv",
  
    // Change URL to csv uploaded on github
    // source: https://gist.github.com/mbostock/7608400
    flights:
      "https://gist.githubusercontent.com/mbostock/7608400/raw/e5974d9bba45bc9ab272d98dd7427567aafd55bc/purpose.csv"
  };
  
  var svg  = d3.select("svg");
  
  var width  = parseInt(svg.attr("width"));
  var height = parseInt(svg.attr("height"));
  var hypotenuse = Math.sqrt(width * width + height * height);
  
  // must be hard-coded to match our topojson projection
  // source: https://github.com/topojson/us-atlas
  var projection = d3.geoAlbers().scale(1280).translate([480, 300]);
  
  var scales = {
    // used to scale aid bubbles
    aids: d3.scaleSqrt()
      .range([4, 18]),
  
    // used to scale number of segments per line
    segments: d3.scaleLinear()
      .domain([0, hypotenuse])
      .range([1, 10])
  };
  
  // have these already created for easier drawing
  var g = {
    basemap:  svg.select("g#basemap"),
    flights:  svg.select("g#flights"),
    aids: svg.select("g#aids"),
    voronoi:  svg.select("g#voronoi")
  };
  
  console.assert(g.basemap.size()  === 1);
  console.assert(g.purpose.size()  === 1);
  console.assert(g.aids.size() === 1);
  console.assert(g.voronoi.size()  === 1);
  
  var tooltip = d3.select("text#tooltip");
  console.assert(tooltip.size() === 1);
  
  // load and draw base map
  d3.json(urls.map).then(drawMap);
  
  // load the aid and flight data together
  let promises = [
    d3.csv(urls.aids, typeaid),
    d3.csv(urls.flights, typeFlight)
  ];
  
  Promise.all(promises).then(processData);
  
  // process aid and flight data
  function processData(values) {
    console.assert(values.length === 2);
  
    let aids = values[0];
    let flights  = values[1];
  
    console.log("aids: " + aids.length);
    console.log("flights: " + purpose.length);
  
    // convert aids array (pre filter) into map for fast lookup
    let iata = new Map(aids.map(node => [node.iata, node]));
  
    // calculate incoming and outgoing degree based on flights
    // flights are given by aid iata code (not index)
    purpose.forEach(function(link) {
      link.source = iata.get(link.donor);
      link.target = iata.get(link.recipient);
  
      link.source.outgoing += link.count;
      link.target.incoming += link.count;
    });
  
    // remove aids out of bounds
    let old = aids.length;
    aids = aids.filter(aid => aid.x >= 0 && aid.y >= 0);
    console.log(" removed: " + (old - aids.length) + " aids out of bounds");
  
    // remove aids with NA state
    old = aids.length;
    aids = aids.filter(aid => aid.state !== "NA");
    console.log(" removed: " + (old - aids.length) + " aids with NA state");
  
    // remove aids without any flights
    old = aids.length;
    aids = aids.filter(aid => aid.outgoing > 0 && aid.incoming > 0);
    console.log(" removed: " + (old - aids.length) + " aids without flights");
  
    // sort aids by outgoing degree
    aids.sort((a, b) => d3.descending(a.outgoing, b.outgoing));
  
    // keep only the top aids
    old = aids.length;
    aids = aids.slice(0, 50);
    console.log(" removed: " + (old - aids.length) + " aids with low outgoing degree");
  
    // done filtering aids can draw
    drawaids(aids);
    drawPolygons(aids);
  
    // reset map to only include aids post-filter
    iata = new Map(aids.map(node => [node.iata, node]));
  
    // filter out flights that are not between aids we have leftover
    old = purpose.length;
    flights = purpose.filter(link => iata.has(link.source.iata) && iata.has(link.target.iata));
    console.log(" removed: " + (old - purpose.length) + " flights");
  
    // done filtering flights can draw
    drawFlights(aids, flights);
  
    console.log({aids: aids});
    console.log({flights: flights});
  }
  
  // draws the underlying map
  function drawMap(map) {
    // remove non-continental states
    map.objects.states.geometries = map.objects.states.geometries.filter(isContinental);
  
    // run topojson on remaining states and adjust projection
    let land = topojson.merge(map, map.objects.states.geometries);
  
    // use null projection; data is already projected
    let path = d3.geoPath();
  
    // draw base map
    g.basemap.append("path")
      .datum(land)
      .attr("class", "land")
      .attr("d", path);
  
    // draw interior borders
    g.basemap.append("path")
      .datum(topojson.mesh(map, map.objects.states, (a, b) => a !== b))
      .attr("class", "border interior")
      .attr("d", path);
  
    // draw exterior borders
    g.basemap.append("path")
      .datum(topojson.mesh(map, map.objects.states, (a, b) => a === b))
      .attr("class", "border exterior")
      .attr("d", path);
  }
  
  function drawaids(aids) {
    // adjust scale
    let extent = d3.extent(aids, d => d.outgoing);
    scales.aids.domain(extent);
  
    // draw aid bubbles
    let bubbles = g.aids.selectAll("circle.aid")
      .data(aids, d => d.iata)
      .enter()
      .append("circle")
      .attr("r",  d => scales.aids(d.outgoing))
      .attr("cx", d => d.x) // calculated on load
      .attr("cy", d => d.y) // calculated on load
      .attr("class", "aid")
      .each(function(d) {
        // adds the circle object to our aid
        // makes it fast to select aids on hover
        d.bubble = this;
      });
  }
  
  function drawPolygons(aids) {
    // convert array of aids into geojson format
    let geojson = aids.map(function(aid) {
      return {
        type: "Feature",
        properties: aid,
        geometry: {
          type: "Point",
          coordinates: [aid.longitude, aid.latitude]
        }
      };
    });
  
    // calculate voronoi polygons
    let polygons = d3.geoVoronoi().polygons(geojson);
    console.log(polygons);
  
    g.voronoi.selectAll("path")
      .data(polygons.features)
      .enter()
      .append("path")
      .attr("d", d3.geoPath(projection))
      .attr("class", "voronoi")
      .on("mouseover", function(d) {
        let aid = d.properties.site.properties;
  
        d3.select(aid.bubble)
          .classed("highlight", true);
  
        d3.selectAll(aid.flights)
          .classed("highlight", true)
          .raise();
  
        // make tooltip take up space but keep it invisible
        tooltip.style("display", null);
        tooltip.style("visibility", "hidden");
  
        // set default tooltip positioning
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dy", -scales.aids(aid.outgoing) - 4);
        tooltip.attr("x", aid.x);
        tooltip.attr("y", aid.y);
  
        // set the tooltip text
        tooltip.text(aid.name + " in " + aid.city + ", " + aid.state);
  
        // double check if the anchor needs to be changed
        let bbox = tooltip.node().getBBox();
  
        if (bbox.x <= 0) {
          tooltip.attr("text-anchor", "start");
        }
        else if (bbox.x + bbox.width >= width) {
          tooltip.attr("text-anchor", "end");
        }
  
        tooltip.style("visibility", "visible");
      })
      .on("mouseout", function(d) {
        let aid = d.properties.site.properties;
  
        d3.select(aid.bubble)
          .classed("highlight", false);
  
        d3.selectAll(aid.flights)
          .classed("highlight", false);
  
        d3.select("text#tooltip").style("visibility", "hidden");
      })
      .on("dblclick", function(d) {
        // toggle voronoi outline
        let toggle = d3.select(this).classed("highlight");
        d3.select(this).classed("highlight", !toggle);
      });
  }
  
  function drawFlights(aids, flights) {
    // break each flight between aids into multiple segments
    let bundle = generateSegments(aids, flights);
  
    // https://github.com/d3/d3-shape#curveBundle
    let line = d3.line()
      .curve(d3.curveBundle)
      .x(aid => aid.x)
      .y(aid => aid.y);
  
    let links = g.purpose.selectAll("path.flight")
      .data(bundle.paths)
      .enter()
      .append("path")
      .attr("d", line)
      .attr("class", "flight")
      .each(function(d) {
        // adds the path object to our source aid
        // makes it fast to select outgoing paths
        d[0].purpose.push(this);
      });
  
    // https://github.com/d3/d3-force
    let layout = d3.forceSimulation()
      // settle at a layout faster
      .alphaDecay(0.1)
      // nearby nodes attract each other
      .force("charge", d3.forceManyBody()
        .strength(10)
        .distanceMax(scales.aids.range()[1] * 2)
      )
      // edges want to be as short as possible
      // prevents too much stretching
      .force("link", d3.forceLink()
        .strength(0.7)
        .distance(0)
      )
      .on("tick", function(d) {
        links.attr("d", line);
      })
      .on("end", function(d) {
        console.log("layout complete");
      });
  
    layout.nodes(bundle.nodes).force("link").links(bundle.links);
  }
  
  // Turns a single edge into several segments that can
  // be used for simple edge bundling.
  function generateSegments(nodes, links) {
    // generate separate graph for edge bundling
    // nodes: all nodes including control nodes
    // links: all individual segments (source to target)
    // paths: all segments combined into single path for drawing
    let bundle = {nodes: [], links: [], paths: []};
  
    // make existing nodes fixed
    bundle.nodes = nodes.map(function(d, i) {
      d.fx = d.x;
      d.fy = d.y;
      return d;
    });
  
    links.forEach(function(d, i) {
      // calculate the distance between the source and target
      let length = distance(d.source, d.target);
  
      // calculate total number of inner nodes for this link
      let total = Math.round(scales.segments(length));
  
      // create scales from source to target
      let xscale = d3.scaleLinear()
        .domain([0, total + 1]) // source, inner nodes, target
        .range([d.source.x, d.target.x]);
  
      let yscale = d3.scaleLinear()
        .domain([0, total + 1])
        .range([d.source.y, d.target.y]);
  
      // initialize source node
      let source = d.source;
      let target = null;
  
      // add all points to local path
      let local = [source];
  
      for (let j = 1; j <= total; j++) {
        // calculate target node
        target = {
          x: xscale(j),
          y: yscale(j)
        };
  
        local.push(target);
        bundle.nodes.push(target);
  
        bundle.links.push({
          source: source,
          target: target
        });
  
        source = target;
      }
  
      local.push(d.target);
  
      // add last link to target node
      bundle.links.push({
        source: target,
        target: d.target
      });
  
      bundle.paths.push(local);
    });
  
    return bundle;
  }
  
  // determines which states belong to the continental united states
  // https://gist.github.com/mbostock/4090846#file-us-state-names-tsv
  function isContinental(state) {
    var id = parseInt(state.id);
    return id < 60 && id !== 2 && id !== 15;
  }
  
  // see aids.csv
  // convert gps coordinates to number and init degree
  function typeaid(aid) {
    aid.longitude = parseFloat(aid.longitude);
    aid.latitude  = parseFloat(aid.latitude);
  
    // use projection hard-coded to match topojson data
    let coords = projection([aid.longitude, aid.latitude]);
    aid.x = coords[0];
    aid.y = coords[1];
  
    aid.outgoing = 0;  // eventually tracks number of outgoing flights
    aid.incoming = 0;  // eventually tracks number of incoming flights
  
    aid.flights = [];  // eventually tracks outgoing flights
  
    return aid;
  }
  
  // see purpose.csv
  // convert count to number
  function typeFlight(flight) {
    flight.count = parseInt(flight.count);
    return flight;
  }
  
  // calculates the distance between two nodes
  // sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
  function distance(source, target) {
    var dx2 = Math.pow(target.x - source.x, 2);
    var dy2 = Math.pow(target.y - source.y, 2);
  
    return Math.sqrt(dx2 + dy2);
  }