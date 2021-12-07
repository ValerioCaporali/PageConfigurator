const Http = new XMLHttpRequest();
const base_url = 'api/Pages/';
let homePages;
let pages;
let selectedHomePage;
let selectedPage;

(async() => {
    var response = await fetch(base_url + 'HomePages');
    homePages = await response.json();
    console.log(homePages[0]);
    document.getElementById('home-pages-number').innerHTML = homePages.length;
    populatePageList("Home", homePages);
})().catch(err => {
    console.log(err);
});

(async() => {
    var response = await fetch(base_url + 'Pages');
    pages = await response.json();
    document.getElementById('pages-number').innerHTML = pages.length;
    populatePageList("Pages", pages);
})().catch(err => {
    console.log(err);
});


// function to populate pages list in sidebar
var populatePageList = (pageType, pages) => {
    var list;
    if (pageType == "Home") {
        list = document.getElementById('home-pages-list');
        for (var i = 0; i < pages.length; i++) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#";
            a.appendChild(document.createTextNode(pages[i].name));
            li.appendChild(a);
            li.setAttribute('onclick', 'openPageStream(' + i + ', "Home")');
            list.appendChild(li);
        }
    } else if (pageType == "Pages") {
        list = document.getElementById('pages-list');
        for (var i = 0; i < pages.length; i++) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#";
            a.appendChild(document.createTextNode(pages[i].name));
            li.appendChild(a);
            li.setAttribute('onclick', 'openPageStream(' + i + ', "Page")');
            list.appendChild(li);
        }
    } else console.log("Unexpected parameter");
}


// use this to get a specific page
var openPageStream = (index, pageType) => {
    if (pageType == "Home") {
        selectedHomePage = homePages[index];
        showPagePreview(selectedHomePage);
    } else if (pageType == "Page") {
        selectedPage = pages[index];
        showPagePreview(selectedPage);
    }
}


// use this to show page preview (home and normale pages)
var showPagePreview = (page) => {
    console.log(page);
    var title = document.getElementById("page-title");
    title.innerHTML = "";
    title.appendChild(document.createTextNode(page.name));
}