// Initialize the map
var map = L.map('map').setView([22.5707, 88.4174], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to fetch and add markers for each collection
function addMarkers(url, iconUrl) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
                    L.marker([item.coordinates.latitude, item.coordinates.longitude], {
                        icon: L.icon({
                            iconUrl: iconUrl,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                            shadowSize: [41, 41]
                        })
                    }).addTo(map)
                    .bindPopup(`
                        <b>${item.name}</b><br>
                        Address: ${item.address}<br>
                        Contact: ${item.contact ? item.contact : item.phone}<br>
                        ${item.website ? 'Website: <a href="' + item.website + '" target="_blank">' + item.website + '</a>' : ''}
                    `);
                } else {
                    console.warn(`Missing coordinates for: ${item.name}`);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch and add markers for Blood Banks
addMarkers('/api/bloodbanks', 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png');

// Fetch and add markers for NGOs
addMarkers('/api/ngos', 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png');

// Fetch and add markers for Hospitals
addMarkers('/api/hospitals', 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png');

// Fetch and display donars
fetch('/api/donars')
    .then(response => response.json())
    .then(data => {
        const donarList = document.getElementById('donar-list');
        data.forEach(donar => {
            const li = document.createElement('li');
            li.className = "mb-2";
            li.innerHTML = `
                <div class="p-2 bg-gray-700 rounded">
                    <h3 class="text-lg font-bold">${donar.name}</h3>
                    <p>Contact: ${donar.contact_number}</p>
                    <p>Address: ${donar.address}</p>
                    <p>Blood Type: ${donar.blood_type}</p>
                    <p>Donation Type: ${donar.donation_type}</p>
                </div>
            `;
            donarList.appendChild(li);
        });
    })
    .catch(error => console.error('Error fetching donars:', error));