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


// use this to show page preview (home and normal pages)
var showPagePreview = (page) => {
    console.log(page);
    document.getElementById("demo-container").style.display = "block";
    var title = document.getElementById("page-title");
    title.innerHTML = "";
    title.appendChild(document.createTextNode(page.name));
    document.getElementById("editButton").style.display = "block";
    var language = document.getElementById("page-language");
    document.getElementById("page-language").style.display = "block";
    document.getElementById("page-language").style.marginRight = "30px";
    document.getElementById("page-default").style.display = "block";
    var select = document.getElementById("language");
    createOptions("language", page.language);
    createOptions("default", page.default);
    fillPage(page.widgets)
        // page.widgets.forEach((widget) => {
        //         console.log(widget);
        //         console.log(widget.row, widget.column);
        //         var element = document.createElement("div");
        //         element.classList.add("header");
        //         element.setAttribute("data-options", "dxItem: { locaction[{row: " + widget.row + ", col: " + widget.column + ", colspan: " + widget.columnSpan + ", screen: 'lg'}, {row: 0, col: 0, colspan: 2, screen: 'sm'}] }");
        //         var p = document.createElement("p");
        //         p.innerHTML = "prova";
        //         element.appendChild(p);
        //         var pageBox = document.getElementById("responsive-box");
        //         pageBox.appendChild(element);
        //     })
        // var attribute = document.createAttribute("data-options");
        // attribute.value = "dxItem: { locaction[{row: " + widget.row + ", col: " + widget.column + ", colspan: " + widget.columnSpan + ", screen: 'lg'}, {row: 0, col: 0, colspan: 2, screen: 'sm'}] }";
        // element.classList.add("header");
        // element.data-options = "";
        // element.attr("data-options", "dxItem: { title: ciao }");
        // $(element).addClass("header");
        // element.setAttributeNode(attribute);
}

var createOptions = (selectId, currentValue) => {
    var languages = ["it", "en"];
    var isDefault = [true, false];
    while (document.getElementById(selectId).options.length > 0) {
        document.getElementById(selectId).remove(0);
    }
    var select = document.getElementById(selectId);
    if (selectId == "language") {
        languages.forEach(async function(language) {
            var option = document.createElement("option");
            option.text = language;
            if (currentValue == language && currentValue != false) {
                option.selected = "selected";
            }
            select.add(option);
        });
    }
    if (selectId == "default") {
        isDefault.forEach(async function(value) {
            var option = document.createElement("option");
            option.text = value;
            if (currentValue == value) {
                option.selected = "selected";
            }
            select.add(option);
        })
    }
}

// $(() => {
//     $('#responsive-box').dxResponsiveBox({
//         rows: [
//             { ratio: 1 },
//             { ratio: 2 },
//             { ratio: 2, screen: 'xs' },
//             { ratio: 1 },
//             { ratio: 1 },
//             { ratio: 1 },
//         ],
//         cols: [
//             { ratio: 1 },
//             { ratio: 1, screen: 'lg' },
//             { ratio: 1 },
//             { ratio: 1 },
//             { ratio: 1 },
//             { ratio: 1 },
//         ],
//         singleColumnScreen: 'sm',
//         screenByWidth(width) {
//             return (width < 700) ? 'sm' : 'lg';
//         },
//     });
// });


var fillPage = (widgets) => {
    var totRows = calculateRows(widgets)
    var totCols = calculateColumns(widgets)
    console.log(totRows)
    console.log(totCols)
    var rows = new Array();
    var cols = new Array();
    var object = { ratio: 1 };
    for (var i = 0; i < totRows; i++) {
        rows.push(object);
    }
    for (var i = 0; i < totCols; i++) {
        cols.push(object);
    }
    console.log(rows)
    console.log(cols)
    let items = widgets.map(w => {
        return {
            location: [{
                row: w.row,
                col: w.column,
                colspan: (w.columnSpan != 0) ? w.columnSpan : 1,
                rowspan: (w.rowSpan != 0) ? w.rowSpan : 1
            }],
            html: handleWidget(w)
        }
    });

    $('#responsive-box').dxResponsiveBox({
        rows: rows,
        cols: cols,
        items: items,
        singleColumnScreen: 'sm',
        screenByWidth(width) {
            return (width < 700) ? 'sm' : 'lg';
        },
    });
}

var calculateRows = (widgets) => {
    var totRows = 0;
    widgets.forEach((widget) => {
        var currentSpan = (widget.rowSpan == 0) ? 1 : widget.rowSpan
        totRows = ((widget.row + currentSpan) > totRows) ? (widget.row + currentSpan) : totRows
    })
    return (totRows == 0) ? (totRows + 1) : totRows;
}

var calculateColumns = (widgets) => {
    var totCols = 0;
    widgets.forEach((widget) => {
        var currentSpan = (widget.columnSpan == 0) ? 1 : widget.columnSpan
        totCols = ((widget.column + currentSpan) > totCols) ? (widget.column + currentSpan) : totCols
    })
    return (totCols == 0) ? (totCols + 1) : totCols;
}

var handleWidget = (widget) => {
    console.log(widget)
    var elem = handelWidgetType(widget);
    if (widget.style != null) {
        elem = handleWidgetStyle(widget, elem);
    }
    return elem;
}

var handelWidgetType = (widget) => {
    switch (widget.type) {
        case 0:
            var div = handleTextWidget(widget);
            return div;
            break;
        case 1:
            var galleryContainer = handleGalleryWidget(widget);
            return galleryContainer;
            break;
        case 2:
            var videoContainer = handleVideoWidget(widget);
            return videoContainer;
            break;
        default:
            var div = document.createElement("div");
            div.innerHTML = "widget to handle";
            return div;
    }
}

var handleTextWidget = (widget) => {
    var div = document.createElement("div");
    div.innerHTML = widget.content.text.trim()
    return div;
}

var handleGalleryWidget = (widget) => {
    var galleryContainer = document.createElement("div");
    var div = document.createElement("div");
    galleryContainer.classList.add("gallery-container");
    var randomId = Math.floor(Math.random() * 1000000)
    console.log("gallery")
    div.id = "gallery" + randomId
    setTimeout(() => {
        $('#gallery' + randomId).dxGallery({
            dataSource: widget.content.source,
            height: "auto",
            width: "inherit",
            maxWidth: "inherit",
            loop: (widget.content.enableLoop) ? widget.content.enableLoop : false,
            slideshowDelay: (widget.content.slideShowDelay) ? widget.content.slideShowDelay : 2000,
            showNavButtons: (widget.content.showNavButtons) ? widget.content.showNavButtons : false,
            showIndicator: (widget.content.showIndicator) ? widget.content.showIndicator : false,
        }).dxGallery('instance');
    }, 1000)
    galleryContainer.appendChild(div);
    setTimeout(() => {
            if (widget.text) {
                text = document.createElement("div");
                text.innerHTML = widget.text.value.trim();
                handelTextPosition(widget, text);
                galleryContainer.appendChild(text);

            }
        }, 2000)
        // div.style.maxWidth = "100%";
    return galleryContainer;
}

var handleVideoWidget = (widget) => {
    var videoContainer = document.createElement("div");
    videoContainer.id = "video-container";
    var video = document.createElement("iframe");
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    // vimeo: https://player.vimeo.com/video/76979871
    // youtube: https://www.youtube.com/embed/qC0vDKVPCrw
    var src = "https://www.youtube.com/embed/qC0vDKVPCrw";
    var video_url = new URL(src);
    console.log(video_url)
    console.log(video_url.searchParams.get('autoplay'))
    var youtubeUrl = "";
    var vimeoUrl = "";
    if (src.match(regExp) || src.indexOf("www.youtube-nocookie") != -1) {
        console.log("youtube url");
        video.allowFullscreen = "true";
        var youtube_video = handleVideo(widget, video_url, video);
        video.src = youtube_video;
    } else if (src.indexOf("player.vimeo" != -1)) {
        video.allowFullscreen = "true";
        var vimeo_video = handleVideo(widget, video_url, video)
        video.src = vimeo_video;
        console.log("vimeo url");
    }
    if (widget.content.width)
        video.style.width = widget.content.width
    if (widget.content.height)
        video.style.height = widget.content.height
    if (widget.content.responsive)
        video.style.width = "100%";
    videoContainer.appendChild(video);
    return videoContainer;
}


var handleWidgetStyle = (widget, div) => {

    div.style.position = "relative";

    /* PADDING */
    if (widget.style.padding) {
        if (widget.style.padding.top) {
            div.style.paddingTop = widget.style.padding.top
        }
        if (widget.style.padding.right) {
            div.style.paddingRight = widget.style.padding.right
        }
        if (widget.style.padding.bottom) {
            div.style.paddingBottom = widget.style.padding.bottom
        }
        if (widget.style.padding.left) {
            div.style.paddingLeft = widget.style.padding.left
        }
        if (widget.style.padding.total) {
            div.style.padding = widget.style.padding.total
        }
    }

    /* MARGIN */
    if (widget.style.margin) {
        if (widget.style.margin.top) {
            div.style.marginTop = widget.style.margin.top
        }
        if (widget.style.margin.right) {
            div.style.marginRight = widget.style.margin.right
        }
        if (widget.style.margin.bottom) {
            div.style.marginBottom = widget.style.margin.bottom
        }
        if (widget.style.margin.left) {
            div.style.marginLeft = widget.style.margin.left
        }
        if (widget.style.margin.total) {
            div.style.margin = widget.style.margin.total
        }
    }

    /* WIDTH */
    if (widget.style.width) {
        div.style.width = widget.style.width
    }

    /* HEIGHT */
    if (widget.style.height) {
        div.style.height = widget.style.height
    }

    /* BACKGROUND */
    if (widget.style.background) {
        div.style.background = widget.style.background
    }

    /* TEXT-COLOR */
    if (widget.style.textColor) {
        div.style.color = widget.style.textColor
    }

    /* FONT-FAMILY */
    if (widget.style.fontFamily) {
        div.style.fontFamily = widget.style.textColor
    }

    /* FONT-SIZE */
    if (widget.style.fontSize) {
        div.style.fontSize = widget.style.fontSize
    }

    /* BORDERS */
    if (widget.style.borders) {
        switch (widget.style.borders.type) {
            case 0:
                div.style.border = widget.style.borders.style
                div.style.borderWidth = widget.style.borders.width;
                div.style.borderColor = widget.style.borders.color;

            case 1:
                div.style.borderLeft = widget.style.borders.style
                div.style.borderWidth = widget.style.borders.width;
                div.style.borderColor = widget.style.borders.color;

            case 2:
                div.style.borderRight = widget.style.borders.style
                div.style.borderWidth = widget.style.borders.width;
                div.style.borderColor = widget.style.borders.color;

            case 3:
                div.style.borderTop = widget.style.borders.style
                div.style.borderWidth = widget.style.borders.width;
                div.style.borderColor = widget.style.borders.color;

            case 4:
                div.style.borderBottom = widget.style.borders.style
                div.style.borderWidth = widget.style.borders.width;
                div.style.borderColor = widget.style.borders.color;
        }

    }

    return div;
}

var handelTextPosition = (widget, text) => {
    if (widget.text.position.type == 0) {
        text.style.position = "absolute";
        text.style.display = "flex";
        text.style.alignItems = "center";
        text.style.justifyContent = "center";
        text.style.top = 0;
        text.style.right = 0;
        text.style.bottom = 0;
        text.style.left = 0;
    } else if (widget.text.position.type == 1) {
        text.style.top = widget.text.position.top;
        text.style.right = widget.text.position.right;
        text.style.bottom = widget.text.position.bottom;
        text.style.left = widget.text.position.left;
    }
}

var handleVideo = (widget, video_url, video) => {
    if (widget.content.enableAutoplay) {
        if (video_url.searchParams.get('autoplay') != null)
            video_url.searchParams.set('autoplay', 1);
        else
            video_url.searchParams.append('autoplay', 1);
        video.allow = "autoplay";
    } else {
        if (video_url.searchParams.get('autoplay') != null)
            video_url.searchParams.set('autoplay', 0)
        else
            video_url.searchParams.append('autoplay', 0)
    }
    if (widget.content.disableControls) {
        if (video_url.searchParams.get('controls') != null) 
            video_url.searchParams.set('controls', 0)
        else
            video_url.searchParams.append('controls', 0)
    } else {
        if (video_url.searchParams.get('controls') != null) 
            video_url.searchParams.set('controls', 1)
        else
            video_url.searchParams.append('controls', 1)
    }
    if (widget.content.enableLoop) {
        if (video_url.searchParams.get('loop') != null)
            video_url.searchParams.set('loop', 1)
        else
            video_url.searchParams.append('loop', 1)
    } else {
        if (video_url.searchParams.get('loop') != null)
            video_url.searchParams.set('loop', 0)
        else
            video_url.searchParams.append('loop', 0)
    }

    return video_url;
}