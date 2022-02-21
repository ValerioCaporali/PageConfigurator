import Methods from "./renderer.js";

const Http = new XMLHttpRequest();
const base_url = 'api/Pages/';
let homePages;
let pages;
let selectedHomePage;
let selectedPage;
let generatedId = [];
var showingStructure = false;

var methods;

(async() => {
    var response = await fetch(base_url + 'HomePages');
    homePages = await response.json();
    document.getElementById('home-pages-number').innerHTML = homePages.length;
    (async() => {
        var response = await fetch(base_url + 'Pages');
        pages = await response.json();
        document.getElementById('pages-number').innerHTML = pages.length;
        methods = new Methods(homePages, pages);
        methods.populatePageList("Home");
        methods.populatePageList("Pages");
    })().catch(err => {
        console.log(err);
    });
})().catch(err => {
    console.log(err);
});