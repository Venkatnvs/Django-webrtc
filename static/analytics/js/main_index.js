let locationData;
const map = L.map("map").setView([0, 0], 2);
// Add a tile layer (e.g., OpenStreetMap) to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        'Nvs Meet &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);
function getData() {
    var apiUrl = "/analytics/get-anly-1?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            locationData = response;
            // console.log(response);
            // Add markers to the map
            locationData.forEach((location) => {
                // console.log(location);
                const marker = L.marker([location.lat, location.lng]).addTo(map);
                marker.bindPopup(
                    `${location.country_code}(${location.city}): ${location.visitors} visitors`
                );
            });
        }
    };
    xhr.send();
}

var chartsdata;
function drawChatCou() {
    var apiUrl = "/analytics/get-anly-country?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // if (chartsdata) {
            //     chartsdata.destroy();
            // }
            var response = JSON.parse(xhr.responseText);
            const labels = response.map((data) => data.country_name);
            const data = response.map((data) => data.count);
            const ctx = document.getElementById("locationChart").getContext("2d");
            var barColors = [
                "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145"
            ];
            chartsdata = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Visitors by Country",
                            data: data,
                            backgroundColor: barColors,
                            borderColor: "#f5f5f5",
                            borderWidth: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    };
    xhr.send();
}

var chartsdata_2;
function drawChatdeviceType() {
    var apiUrl = "/analytics/get-anly-device?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // if (chartsdata_2) {
            //     chartsdata_2.destroy();
            // }
            var response = JSON.parse(xhr.responseText);
            // console.log(response)
            const labels = response.map((data) => data.page__devicetype);
            const data = response.map((data) => data.count);
            const ctx = document.getElementById("deviceTypeChart").getContext("2d");
            var barColors = [
                "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145"
            ];
            chartsdata_2 = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Visitors by Device",
                            data: data,
                            backgroundColor: barColors,
                            borderColor: "#f5f5f5",
                            borderWidth: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    };
    xhr.send();
}


// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

// // Map and projection
// var projection = d3.geoMercator()
//     .scale(85)
//     .translate([width/2, height/2*1.3])

// // Create data: coordinates of start and end
// var link = [
//   {type: "LineString", coordinates: [[100, 60], [-60, -30]]},
//   {type: "LineString", coordinates: [[10, -20], [-60, -30]]},
//   {type: "LineString", coordinates: [[10, -20], [130, -30]]}
// ]

// // A path generator
// var path = d3.geoPath()
//     .projection(projection)

// // Load world shape
// d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

//     // Draw the map
//     svg.append("g")
//         .selectAll("path")
//         .data(data.features)
//         .enter().append("path")
//             .attr("fill", "#b8b8b8")
//             .attr("d", d3.geoPath()
//                 .projection(projection)
//             )
//             .style("stroke", "#fff")
//             .style("stroke-width", 0)

//     // Add the path
//     svg.selectAll("myPath")
//       .data(link)
//       .enter()
//       .append("path")
//         .attr("d", function(d){ return path(d)})
//         .style("fill", "none")
//         .style("stroke", "orange")
//         .style("stroke-width", 2)

// })
const spanActiveUsr = document.getElementById('real_time_num_dig');
var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

const socket = new WebSocket(ws_scheme + '://'
    + window.location.host
    + '/ws/realtime/admin/1/');

socket.onopen = function (event) {
    socket.send(JSON.stringify({ "message": { "admin": true } }))
    console.log('WebSocket connection established');
};

// Handle WebSocket message received event
socket.onmessage = function (event) {
    const userCount = JSON.parse(event.data);
    spanActiveUsr.innerText = userCount['user_count'];
    getRealTimecont()
    getData();
    // chartsdata.data.datasets.forEach((dataset) => {
    //     console.log(dataset)
    //     dataset.data.pop();
    // });
    // chartsdata.update();
    console.log('Real-time user count:', userCount);
};

// Handle WebSocket connection close event
socket.onclose = function (event) {
    console.log('WebSocket connection closed');
};

const ulElementRealTime = document.getElementById('user_part_cont')
function getRealTimecont(){
    var apiUrl = "/analytics/get-realtime-country?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            ulElementRealTime.innerHTML = ""
            var response = JSON.parse(xhr.responseText);
            console.log(response)
            response.forEach((data)=>{
                if((data.country_name) && (data.country_name!=null)){
                    liHtml = `<li class="list-group-item"><span>${data.country_name}</span><span>${data.count}</span></li>`
                    ulElementRealTime.innerHTML += liHtml
                }
            })
        }
    }
    xhr.send();
}

mainAllFun()
function mainAllFun() {
    getData();
    drawChatCou();
    drawChatdeviceType();
}