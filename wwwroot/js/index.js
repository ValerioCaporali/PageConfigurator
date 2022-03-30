import RenderManager from "./render-manager.js";

const base_url = 'api/Pages/';
let renderer;

(async () => {
    let response = await fetch(base_url + 'get-all');
    let pages = await response.json();
    renderer = new RenderManager(pages);
    renderer.populatePageList();
})().catch(err => {
    console.log(err);
})