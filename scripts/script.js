'use strict';

//Mapboxの初期化
mapboxgl.accessToken = 'pk.eyJ1IjoibWlsb3VqcCIsImEiOiJjbDVhb2h2OWwwYTgyM2lueHd2ZWRjM2pmIn0.1uihWRQNrYVmnJke9wqAEQ';
const bounds = [
    [122.598, 19.702], // 領域制限の南西
    [155.720, 47.618] // 領域制限の北東
    ];
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/miloujp/cl5sxmd3n000614nb1uh47sn3',
    center: [139.7671, 35.6812],
    zoom: 10,
    maxBounds: bounds
});

//フィルター作成
function filterBy(year) {
    const filters = ['all', ['<=', 'N05_005b', year], ['>=', 'N05_005e', year]];
    map.setFilter('railhistory-jr-layer', filters);
    map.setFilter('railhistory-private-layer', filters);
    map.setFilter('stationhistory-layer', filters);
    document.getElementById('year').textContent = year;
}
//線幅の設定リスト
const lineWidth = [
    'interpolate', ['linear'], ['zoom'],
    5, 1,
    10, 4.5,
    22, 14
];
const lineWidth2 = [
    'interpolate', ['linear'], ['zoom'],
    5, 1,
    10, 1.6,
    22, 5
];


//地図の描画
map.on('load', () => {

    map.addControl(new mapboxgl.NavigationControl());

    //鉄道時系列データの読み込み
    map.addSource('railhistory-jr', {
        type: 'geojson',
        data: 'data/railroad_history_JR.geojson'
    });
    map.addSource('railhistory-private', {
        type: 'geojson',
        data: 'data/railroad_history_private.geojson'
    });
    map.addSource('stationhistory', {
        type: 'geojson',
        data: 'data/station_history.geojson'
    });

    map.addLayer({
        id: 'railhistory-jr-layer',
        type: 'line',
        source: 'railhistory-jr',
        paint: {
            'line-pattern': 'rail1',
            'line-width': lineWidth
        }
    });
    map.addLayer({
        id: 'railhistory-private-layer',
        type: 'line',
        source: 'railhistory-private',
        paint: {
            'line-color': '#444444',
            'line-width': lineWidth2
        }
    });
    map.addLayer({
        id: 'stationhistory-layer',
        type: 'circle',
        source: 'stationhistory',
        paint: {
            'circle-color': 'black',
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                5, 1,
                10, 2,
                22, 15
            ]
        }
    });

    //フィルターの実行 初期値は2020年
    filterBy(2020);
    document.getElementById('slider').addEventListener('input', (e) => {
        const year = parseInt(e.target.value, 10);
        filterBy(year);
    });

    //クリックしたときの処理
    map.on('click', 'railhistory-jr-layer', (e) => {
        const railLineName = e.features[0].properties['N05_002'];
        const railLineCompany = e.features[0].properties['N05_003'];
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(railLineCompany + railLineName)
            .addTo(map);
    });
    map.on('click', 'railhistory-private-layer', (e) => {
        const railLineName = e.features[0].properties['N05_002'];
        const railLineCompany = e.features[0].properties['N05_003'];
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(railLineCompany + railLineName)
            .addTo(map);
    });
    map.on('click', 'stationhistory-layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties['N05_011'])
            .addTo(map);
    });

});