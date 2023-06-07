let locationData;
function getData() {
    var apiUrl = "/analytics/get-anly-1?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            locationData = response;
            console.log(response);
            const map = L.map("map").setView([0, 0], 2);

            // Add a tile layer (e.g., OpenStreetMap) to the map
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    'Nvs Meet &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(map);

            // Add markers to the map
            locationData.forEach((location) => {
                console.log(location);
                const marker = L.marker([location.lat, location.lng]).addTo(map);
                marker.bindPopup(
                    `${location.country_code}(${location.city}): ${location.visitors} visitors`
                );
            });
        }
    };
    xhr.send();
}
getData();

function drawChatCou() {
    var apiUrl = "/analytics/get-anly-country?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            const labels = response.map((data) => data.country_name);
            const data = response.map((data)=> data.count);
            const ctx = document.getElementById("locationChart").getContext("2d");
            var barColors = [
                "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145"
            ];
            new Chart(ctx, {
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
drawChatCou();


function drawChatdeviceType() {
    var apiUrl = "/analytics/get-anly-device?format=json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            const labels = response.map((data) => data.page__devicetype);
            const data = response.map((data)=> data.count);
            const ctx = document.getElementById("deviceTypeChart").getContext("2d");
            var barColors = [
                "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9",
                "#1e7145"
            ];
            new Chart(ctx, {
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
drawChatdeviceType();