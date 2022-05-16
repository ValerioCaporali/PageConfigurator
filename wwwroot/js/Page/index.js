import PageRender from "../page-render.js";

let location = window.location.href.toString();
let arr = location.split('/');
let pageId = arr[arr.length-2];
let pageLan = arr[arr.length-1];

const data = {
    id: pageId
};

const options = {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};

fetch('https://localhost:5001/api/pages/get', options).then(response => {
    if(!response.ok) {
        response.json()
            .then(({message}) => {
                $(() => {
                    DevExpress.ui.notify(message);
                });
            })
    }
    else
    {
        response.json().then(data => {
            let specificContent;
            data.contents.forEach(content => {
                if (content.language == pageLan && pageLan)
                    specificContent = content;
                else if (!content.language)
                    specificContent = content;
            })
            let renderer = new PageRender(data, specificContent);
            renderer.openPageStream(data, specificContent);
        })
    }
})