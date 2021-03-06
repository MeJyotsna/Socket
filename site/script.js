var order = "asc";
var table, available;
var intervalBoolean = false;
var sparkJson = [];

refine = (data) => {
  var midprice;
  table = document.getElementById("dataTable");
  var arr = [];
  var tableRows = table.getElementsByTagName("TR");
  var thRows = tableRows[0].getElementsByTagName("TH");
  for (let i = 0; i < thRows.length - 1; i++) {
    arr.push(thRows[i].id);
  }
  if (tableRows.length <= 1) {
    var row = table.insertRow(1);
    for (let i = 0; i < arr.length; i++) {
      if (i == 0) row.insertCell(i).innerHTML = data[arr[i]];
      else row.insertCell(i).innerHTML = data[arr[i]].toFixed(4);
    }
    row.insertCell(arr.length).id = data[arr[0]];
    midprice = (data.bestBid + data.bestAsk) / 2;
    pushToSpark(data[arr[0]], midprice);
  } else {
    available = false;
    // if same name pair is available in current table then update existing one.
    for (var i = 1; i < tableRows.length; i++) {
      var colValue = tableRows[i].getElementsByTagName("TD");
      var tdValue = colValue[0];
      if (tdValue.innerHTML == data.name) {
        for (var j = 1; j < arr.length; j++) {
          colValue[j].innerHTML = data[arr[j]].toFixed(4);
        }
        midprice = (data.bestBid + data.bestAsk) / 2;
        sparkJson.forEach((item) => {
          if (item.name == data[arr[0]]) {
            if (data.timer > 29) {
              item.values.shift();
              item.values.push(midprice);
            } else {
              item.values.push(midprice);
            }
          }
        });
        available = true;
      }
    }
    // if currencies pair is not avaialble in current table then insert a new one.
    if (!available) {
      row = table.insertRow(tableRows.length);
      for (let i = 0; i < arr.length; i++) {
        if (i == 0) row.insertCell(i).innerHTML = data[arr[i]];
        else row.insertCell(i).innerHTML = data[arr[i]].toFixed(4);
      }
      row.insertCell(arr.length).id = data[arr[0]];
      midprice = (data.bestBid + data.bestAsk) / 2;
      pushToSpark(data[arr[0]], midprice);
    }
  }
  sortTable(order);
  plotSparkline();
};

pushToSpark = (name, midprice) => {
  var jsonObj = {};
  jsonObj.name = name;
  jsonObj.values = [midprice];
  sparkJson.push(jsonObj);
};

// to draw sparkline
plotSparkline = () => {
  sparkJson.forEach((item) => {
    const exampleSparkline = document.getElementById(item.name);
    Sparkline.draw(exampleSparkline, item.values, {
      tooltip: function (value, index, array) {
        return index + 1 + " , " + value.toFixed(4);
      },
    });
  });
};

// toggle order
changeOrder = () => {
  order == "asc" ? (order = "desc") : (order = "asc");
};

sortTable = (order) => {
  var table, rows, i, x, y, shouldSwitch, dir;
  table = document.getElementById("dataTable");
  var switching = true;
  dir = order;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      // on basis of best bid last change (column 3) table needs to be sorted
      x = rows[i].getElementsByTagName("TD")[3];
      y = rows[i + 1].getElementsByTagName("TD")[3];
      if (dir == "asc") {
        if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    // switch the cell
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
};
