var width = 980,
    height = 500;

var cityData = [
  {name: "Geneva", coordinates: [6.1427, 46.1984]},
  {name: "Lancy", coordinates: [6.11841, 46.1863]},
  {name: "Plan-les-Ouates", coordinates: [6.1167, 46.1662]},
  {name: "Cologny", coordinates: [6.1397, 46.2210]},
  {name: "Bellevue", coordinates: [6.1456, 46.2558]},
  {name: "Versoix", coordinates :[6.1626, 46.2846]},
  {name: "Grand-Saconnex", coordinates: [6.1169, 46.2332]}
];

var timeFormat = d3.time.format('%Y-%m-%d %H:%M:%S');

var transit = crossfilter(),
    stop = transit.dimension(function (d) {return d.stopCode;});

var projection = d3.geo.mercator()
  .scale(900000)
  .center([6.14, 46.20])
  .translate([width/2,height/2]);

var path = d3.geo.path()
    .projection(projection);

var t = projection.translate();

var s = projection.scale();

var columns = ['Date', 'Actual Stop Time', 'Scheduled Stop Time', 'Delay (ms)', 'Trip Length(m)'];

var svg = d3.select("#figure")
    .datum ([])
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on('click',redraw);

var table = d3.select('#table')
  .append('table');

var thead = table.append('thead').append('tr');

var tbody = table.append('tbody');

d3.csv('/data/geneva/schedule-real-time.csv', function (err, response) {

  data = cleanData(response);

  var minDate = d3.min(data, function (d) {return d.date;}),
      maxDate = d3.max(data, function (d) {return d.date;}),
      maxDelay = d3.max(data, function (d) {return d.delay;});

thead.selectAll('th')
  .data(d3.keys(data[0]))
  .enter().append('td')
  .text(function (d) {return d;});

  drawTable();
  transit.add(data);
  drawRoutes();
});

function drawTable () {
  var rows = tbody.selectAll('tr')
    .data(stop.top(Infinity));

  rows.enter().append('tr');

  rows.exit().remove();

  var cells = rows.selectAll('td')
    .data(function (d) {return d3.values(d);})
    .text(function (d) {return d;});

  cells.enter().append('td')
    .text(function (d) {return d.stopNumber;});

  cells.exit().remove();
}


function drawStops () {
  d3.json('/data/geneva/geo/geojson/stops.json', function (err, data) {
    svg.selectAll('.stop')
        .data(data.features)
      .enter().append('circle')
        .attr('cx', function (d) {return projection(d.geometry.coordinates)[0];})
        .attr('cy', function (d) {return projection(d.geometry.coordinates)[1];})
        .attr('r', 2)
        .attr('class', 'stop')
        .on('mouseover', mouseover);
  });
}

function drawRoutes () {
  d3.json('/data/geneva/geo/geojson/routes.json', function (err, data) {
    svg.selectAll(".route")
        .data(data.features)
      .enter().append('path')
        .attr("d", path)
        .attr('class', 'route');

    drawStops();
  });

}

function redraw(d) {
  var scale = 1,
    x = 0,
    y = 0,
    r = 2;


  if(d.clicked) {
    d.clicked = null;
  }
  else {
    scale = 4;
    x =  -d3.mouse(this)[0] * (scale -1);
    y = -d3.mouse(this)[1] * (scale -1);

    r = 0.5;
    d.clicked = true;
  }

  svg.selectAll(".route")
    .attr('transform','translate('+ x +',' + y +')scale(' + scale + ')');

  svg.selectAll(".stop")
    .attr('transform', 'translate('+ x +',' + y +')scale(' + scale + ')')
    .selectAll('circle').attr('r', r);
}

function mouseover (data) {
    stop.filterExact(data.properties.stopCode);
    if(stop.top(1000)) drawTable ();
}

function cleanData (data) {
  data.forEach(function (d) {
    d.date = timeFormat.parse(d.date);
    d.stopTimeReal = timeFormat.parse(d.stopTimeReal);
    d.stopTimeSchedule = timeFormat.parse(d.stopTimeSchedule);
    d.delay = d.stopTimeReal - d.stopTimeSchedule;
    d.tripLength = +d.tripLength;
    d.passengerCountTripUp = +d.passengerCountTripUp;
    d.passengerCountTripDown = +d.passengerCountTripDown;
    d.passengerCountStopUp = +d.passengerCountStopUp;
    d.passengerCountStopDown = +d.passengerCountStopDown;
    d.passengerLoadStop = +d.passengerLoadStop;
    d.passengerCountDoor1Up = +d.passengerCountDoor1Up;
    d.passengerCountDoor1Down = +d.passengerCountDoor1Down;
    d.passengerCountDoor2Up = +d.passengerCountDoor2Up;
    d.passengerCountDoor2Down = +d.passengerCountDoor2Down;
    d.passengerCountDoor3Up = +d.passengerCountDoor3Up;
    d.passengerCountDoor3Down = +d.passengerCountDoor3Down;
    d.passengerCountDoor4Up = +d.passengerCountDoor4Up;
    d.passengerCountDoor4Down = +d.passengerCountDoor4Down;
    d.passengerCountDoor5Up = +d.passengerCountDoor5Up;
    d.passengerCountDoor5Down = +d.passengerCountDoor5Down;
    d.passengerCountDoor6Up = +d.passengerCountDoor6Up;
    d.passengerCountDoor6Down = +d.passengerCountDoor6Down;
    d.stopLength = +d.stopLength;
    d.passengerDelta = d.passengerCountTripUp - d.passengerCountTripDown;
  });
  return data;
}