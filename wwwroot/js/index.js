import RenderManager from "./render-manager.js";

const base_url = 'api/Pages/';
let renderer;

let xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', base_url + 'get-all', true);
xhr.onload = function() {
    let pages = xhr.response;
    renderer = new RenderManager(pages);
    renderer.populatePageList();
}
xhr.send(null);