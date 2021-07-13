
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: pinpoint, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

var popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(pinpoint)
    .setHTML("<h6> <%=camp.title%> </h6>");

const marker = new mapboxgl.Marker()
    .setLngLat(pinpoint)
    .setPopup(popup)
    .addTo(map);
