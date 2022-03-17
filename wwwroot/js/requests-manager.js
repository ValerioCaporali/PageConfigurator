import Render from "./render-manager.js";

export default class RequestManager {

    base_url = 'api/Pages/';
    pageToSave;
    initialPage;

    constructor(pageToSave, initialPage) {

        this.pageToSave = pageToSave;
        this.initialPage = initialPage;

    }

    savePage() {

        const data = {
            page: this.pageToSave,
            initialPage: this.initialPage
        }

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        }

        fetch(this.base_url + 'save-page', options)
            .then(response => response.json())
            .then (response => console.log(response))
            .catch(error => console.log(error));

    }

}

const base_url = 'api/Pages/';
let homePages;
let pages;

var renderer;

(async() => {
    var response = await fetch(base_url + 'home-pages');
    homePages = await response.json();
    document.getElementById('home-pages-number').innerHTML = homePages.length;
    (async() => {
        var response = await fetch(base_url + 'pages');
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

(async() => {
    var response = await fetch(base_url + 'get-all');
    pages = await response.json();
    console.log("pagine dal database ", pages)
})().catch(err => {
    console.log(err);
});