import RenderManager from "./render-manager.js";

const base_url = 'api/Pages/';
let renderer;

let xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', base_url + 'get-all', true);

var loadPanel = $('.loader').dxLoadPanel({
    shadingColor: 'rgba(0,0,0,0.4)',
    position: { of: '#loader-container' },
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
  }).dxLoadPanel('instance');

xhr.addEventListener('progress', () => {
    loadPanel.show();
});

xhr.addEventListener('load', () => {
    setTimeout(() => {
        loadPanel.hide();
        let pages = xhr.response;
        console.log("PAGES ", pages);
        renderer = new RenderManager(pages);
        renderer.populatePageList();
    }, 600);
});

xhr.send(null);