import Render from "./render-manager.js";

const base_url = 'api/Pages/';
let homePages;
let pages;

var renderer;

(async() => {
    var response = await fetch(base_url + 'HomePages');
    homePages = await response.json();
    document.getElementById('home-pages-number').innerHTML = homePages.length;
    (async() => {
        var response = await fetch(base_url + 'Pages');
        pages = await response.json();
        document.getElementById('pages-number').innerHTML = pages.length;
        renderer = new Render(homePages, pages);
        renderer.populatePageList("Home");
        renderer.populatePageList("Pages");
    })().catch(err => {
        console.log(err);
    });
})().catch(err => {
    console.log(err);
});