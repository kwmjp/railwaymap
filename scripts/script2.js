'use strict';

//Mapboxの初期化
mapboxgl.accessToken = 'pk.eyJ1IjoibWlsb3VqcCIsImEiOiJjbDVhb2h2OWwwYTgyM2lueHd2ZWRjM2pmIn0.1uihWRQNrYVmnJke9wqAEQ';
const bounds = [
    [122.598, 19.702], // 領域制限の南西
    [155.720, 47.618] // 領域制限の北東
    ];
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/miloujp/cl6rbuq4z00bu15npquhn1gt1',
    center: [139.7671, 35.6812],
    zoom: 10,
    maxBounds: bounds
});

//フィルター作成
function filterBy(year) {
    const filters = ['all', ['<=', 'N05_005b', year], ['>=', 'N05_005e', year]];
    map.setFilter('railhistory-jr', filters);
    map.setFilter('railhistory-private', filters);
    map.setFilter('stationhistory', filters);
    document.getElementById('year').textContent = year;
}

//地図内の路線情報を取得してリストに追加
function showRailList() {
    document.getElementById('info').innerText = '';
    const railList = [];
    const features = map.queryRenderedFeatures({layers: ['railhistory-jr', 'railhistory-private']});
    for (const feature of features) {
        const railInfo = feature.properties['N05_003'] + feature.properties['N05_002'];
        if( railList.indexOf(railInfo) == -1 ) {
            railList.push(railInfo);
        };            
    };
    document.getElementById('info').insertAdjacentText('beforeend', railList);
}


//地図の描画
map.on('load', () => {

    map.addControl(new mapboxgl.NavigationControl());

    //フィルターの実行 初期値は2020年
    filterBy(2020);
    document.getElementById('slider').addEventListener('input', (e) => {
        const year = parseInt(e.target.value, 10);
        filterBy(year);
        showRailList();
    });

    //クリックしたときの処理
    map.on('click', 'railhistory-jr', (e) => {
        const railLineName = e.features[0].properties['N05_002'];
        const railLineCompany = e.features[0].properties['N05_003'];
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(railLineCompany + railLineName)
            .addTo(map);
    });
    map.on('click', 'railhistory-private', (e) => {
        const railLineName = e.features[0].properties['N05_002'];
        const railLineCompany = e.features[0].properties['N05_003'];
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(railLineCompany + railLineName)
            .addTo(map);
    });
    map.on('click', 'stationhistory', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties['N05_011'])
            .addTo(map);
    });

    //地図が動いた時の処理
    map.on('moveend', (e) => {
        showRailList();
    });

});