import PageRender from "../page-render.js";
import SaveManager from "../requests.js";

let location = window.location.href.toString();
let arr = location.split('/');
let pageId = arr[arr.length-2];
let pageLan = arr[arr.length-1];

const data = {
    id: pageId
};

let page = await  new SaveManager().getPageById(pageId, pageLan);
let renderer = new PageRender(page.metadata, page.content);
renderer.openPageStream(page.metadata, page.content);