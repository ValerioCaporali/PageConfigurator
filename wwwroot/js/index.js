import RenderManager from "./render-manager.js";

const base_url = 'api/Pages/';
let renderer;

let spinner = $('.prova').dxLoadPanel({
    shadingColor: 'rgba(0,0,0,0.4)',
    position: { of: '#boh' },
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
}).dxLoadPanel('instance');

window.onload = () => {
    spinner.show();
    fetch(base_url + 'get-all')
    .then(response => {
        response.json()
        .then(pages => {
            renderer = new RenderManager(pages);
                renderer.populatePageList();
                spinner.hide();
        });
    });
};