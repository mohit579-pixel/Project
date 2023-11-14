mapboxgl.accessToken=mapToken;
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
    });
// console.log(mapToken);
// const marker = new mapboxgl.Marker()
// .setLngLat(coordinates)
// .addTo(map);