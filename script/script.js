require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend'
    
], (Map, SceneView, FeatureLayer, GraphicsLayer, Legend) => {

    const map = new Map({
        basemap: "topo-vector"
    });

    const view = new SceneView({
        map: map,
        container: "viewDiv",
        zoom: 5,
        center: [-95, 36]
    });
    const gl = new GraphicsLayer({
    });

    const f1 = new FeatureLayer({
        url:'https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0'
    });
    const f2 = new FeatureLayer({
        url:'https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0'
    });
    map.add(gl);
    map.add(f1);
    

    const legend = new Legend({
        view: view
    });
    

    view.ui.add(legend, {position: "bottom-right"});

    let query = f2.createQuery();
    query.where = '"MAGNITUDE" > 4';
    query.outFields = ['*'];
    query.returnGeometry = true;

    f2.queryFeatures(query)
    .then(response => {
        getResults(response.features);
    })
    .catch(err =>{
        console.log(err);
    })

    const getResults = (features) =>{
        const symbol = {
            type: "point-3d",
            symbolLayers: [{
            type: "object",
            width: 8000,
            height: 200000, 
            resource: { primitive: "cube" },
            material: { color: "red" }
            }]
        };
        features.map(elem =>{
            elem.symbol = symbol;
        });
        gl.addMany(features)
    }


    const simple ={
        type: "simple",
        symbol:{
            type: "point-3d",
            symbolLayers:[
                {
                    type: "object",
                    resource: {
                        primitive: "inverted-cone"
                    },
                    width: 5000
                }
            ]
        },
        label: "Eearthquake",
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0,
                        color: "green"
                    },
                    {
                        value: 5,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -4,
                        size: 25000
                    },
                    {
                        value: 31,
                        size: 55000
                    }
                ]
            }

        ]
    };
    f1.renderer = simple;
});
