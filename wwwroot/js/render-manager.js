import ModifyManager from './modify-manager.js'
import HistoryManager from './history-manager.js';
import SaveManager from './save-manager.js';
export default class RenderManager {

    homePages;
    pages;
    selectedHomePage;
    selectedPage;
    generatedId = [];
    contentTextareaId = [];
    showingStructure = false;
    filterPageParameters;
    historyManager = new HistoryManager();
    saveInDraftButton;
    deleteDraftButton;
    publishButton;

    constructor(pages) {
        this.pages = JSON.parse(JSON.stringify(pages));
        document.getElementById('structure-icon').addEventListener("click", () => {
            this.changeMode();
        })
        document.getElementById('go-back').addEventListener("click", () => {
            this.showPageList();
        })
    }

    populatePageList = () => {

        this.checkDeletedDraft()

        let homeContainer = document.getElementById("home-pages-container");
        let pageContainer = document.getElementById("pages-container");
        this.pages.forEach(page => {
            let pageCard = document.createElement('div');
            pageCard.classList.add('page-card');
            let pageImage = document.createElement("img");
            pageImage.classList.add('card-img-top');
            pageImage.src = "https://img.icons8.com/glyph-neue/452/paper.png";
            let pageTitle = document.createElement("h6");
            pageTitle.classList.add('card-title');
            pageTitle.innerHTML = page.description;
            pageTitle.style.textAlign = "center";
            pageCard.append(pageImage, pageTitle);
            $(pageCard).attr("data-toggle", "modal");
            $(pageCard).attr("data-target", "#options-modal");
            if (page.type == 0)
                homeContainer.appendChild(pageCard);
            else
                pageContainer.appendChild(pageCard);
            pageCard.addEventListener('click', () => {
                this.showOptions(page);
            })
        })

    }

    showPageList()
    {
        localStorage.clear();
        if (!this.historyManager.isHistoryEmpty()) {
            let message = "Tutte le modifiche andranno perse";
            if(confirm(message)) {
                document.getElementById('list').style.display = "block";
                document.getElementById('main').style.display = "none";
                window.location.reload();
            }
        }
        else {
            document.getElementById('list').style.display = "block";
            document.getElementById('main').style.display = "none";
            window.location.reload();
        }
    }

    checkDeletedDraft() {
        if (localStorage.getItem("id") != null) {
            let id = localStorage.getItem("id").toString();
            this.pages.forEach(page => {
                if (page.id == id) {
                    document.getElementById('list').style.display = "none";
                    document.getElementById('main').style.display = "block";
                    document.getElementById("status").innerHTML = "pubblicato";
                    document.getElementById("status").style.color = "#22a93d";
                    this.openPageStream(page, page.contents[0]);
                }
            })
        }
    }

    showOptions(page) {
        let pageOptionsContainer = document.getElementById('page-options');
        pageOptionsContainer.innerHTML = "";
        if (page.drafts != null) {
            page.drafts.forEach(draft => {
                let pageCard = document.createElement('div');
                pageCard.classList.add('page-card');
                let pageImage = document.createElement("img");
                pageImage.classList.add('card-img-top');
                pageImage.src = "https://img.icons8.com/glyph-neue/452/paper.png";
                let pageTitle = document.createElement("h6");
                pageTitle.classList.add('card-title');
                pageTitle.innerHTML = draft.language ? draft.language + ' (Draft)' : 'Default (Draft)';
                pageTitle.style.textAlign = "center";
                pageCard.append(pageImage, pageTitle);
                pageCard.style.backgroundColor = "white"
                pageOptionsContainer.appendChild(pageCard);
                pageCard.addEventListener("click", () => {
                    document.getElementById("status").innerHTML = "bozza";
                    document.getElementById("status").style.color = "#e03e0d";
                    $(pageCard).attr("data-toggle", "modal");
                    $(pageCard).attr("data-target", "#options-modal");
                    document.getElementById('list').style.display = "none";
                    document.getElementById('main').style.display = "block";
                    this.openPageStream(page, draft);
                })
            });
        }
        else {
            page.contents.forEach(content => {
                let pageCard = document.createElement('div');
                pageCard.classList.add('page-card');
                let pageImage = document.createElement("img");
                pageImage.classList.add('card-img-top');
                pageImage.src = "https://img.icons8.com/glyph-neue/452/paper.png";
                let pageTitle = document.createElement("h6");
                pageTitle.classList.add('card-title');
                pageTitle.innerHTML = content.language ? content.language : 'Default';
                pageTitle.style.textAlign = "center";
                pageCard.append(pageImage, pageTitle);
                pageCard.style.backgroundColor = "white"
                pageOptionsContainer.appendChild(pageCard);
                pageCard.addEventListener("click", () => {
                    document.getElementById("status").innerHTML = "pubblicato";
                    document.getElementById("status").style.color = "#22a93d";
                    $(pageCard).attr("data-toggle", "modal");
                    $(pageCard).attr("data-target", "#options-modal");
                    document.getElementById('list').style.display = "none";
                    document.getElementById('main').style.display = "block";
                    this.openPageStream(page, content);
                })
            });
        }
    }

    loadPanel = $('.loadpanel').dxLoadPanel({
        shadingColor: 'rgba(0,0,0,0.4)',
        position: { of: '#spinner-container' },
        visible: false,
        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
      }).dxLoadPanel('instance');

    openPageStream = (fullPage, contentOrDraft) => {
        document.getElementById('page-title').innerHTML = contentOrDraft.title;
        this.loadPanel.show()
        setTimeout(() => {
            if (fullPage.drafts != null) {
                this.deleteDraftButton.option("disabled", false);
                this.publishButton.option("disabled", false);
            }
            let page = JSON.parse(JSON.stringify(fullPage));
            page.contents = contentOrDraft;
            this.showPagePreview(page);
            this.selectedPage = page;
            this.historyManager = new HistoryManager();
            this.initHistoryButton();
            this.loadPanel.hide();
        }, 400);
    }

    buttons = [
        { id: 1, name: 'Salva bozza', icon: 'box' },
        { id: 2, name: 'Elimina bozza', icon: 'trash' },
        { id: 3, name: 'Pubblica', icon: 'upload' },
      ];

    initButtons = $(() => {
        let that = this;
        $('#buttons').dxDropDownButton({
        items: that.buttons,
        splitButton: false,
        text: 'Salva',
        displayExpr: 'name',
        keyExpr: 'id',
        useSelectMode: false,
        onItemClick(e) {
            switch (e.itemData.id) {
                case 1:
                    that.loadPanel.show();
                    setTimeout(() => {
                        that.loadPanel.hide();       
                        if (that.historyManager.isHistoryEmpty())
                            $(() => {
                                DevExpress.ui.notify("La pagina non è stata modificata", "warning");
                            });
                        else {
                            let saveManager = new SaveManager();
                            saveManager.saveInDraft(that.selectedPage, that.historyManager.getInitialPage());
                            that.historyManager.emptyHistory();
                            document.getElementById("prev-page").style.display = "none";
                            document.getElementById("status").innerHTML = "bozza";
                            document.getElementById("status").style.color = "#e03e0d";
                        }
                      }, 400);
                    break;

                case 2:
                    that.loadPanel.show();
                    setTimeout(() => {
                        that.loadPanel.hide();
                        let saveManager = new SaveManager();
                        saveManager.deleteDraft(that.selectedPage.id);
                        that.selectedPage.drafts = null;
                        localStorage.setItem("id", that.selectedPage.id);
                        window.location.reload();
                      }, 400);
                    break;

                case 3:
                    let saveManager = new SaveManager();
                    saveManager.publishPage(id);
                    window.location.reload();
                    break;
            
                default:
                    break;
            }
          },
      });
    });

    // initSaveInDraftButton = $(() => {
    //     let that = this;
    //     this.saveInDraftButton = $('#save-page').dxButton({
    //       text: 'Salva bozza',
    //       icon: 'box',
    //       type: 'default',
    //       disabled: true,
    //       onClick() {
    //         that.loadPanel.show();
    //         setTimeout(() => {
    //             that.loadPanel.hide();       
    //             if (that.historyManager.isHistoryEmpty())
    //                 $(() => {
    //                     DevExpress.ui.notify("La pagina non è stata modificata", "warning");
    //                 });
    //             else {
    //                 let saveManager = new SaveManager();
    //                 saveManager.saveInDraft(that.selectedPage, that.historyManager.getInitialPage());
    //                 that.historyManager.emptyHistory();
    //                 document.getElementById("prev-page").style.display = "none";
    //                 that.deleteDraftButton.option("disabled", false);
    //                 that.publishButton.option("disabled", false);
    //                 that.saveInDraftButton.option("disabled", true);
    //             }
    //           }, 400);
    //         }
    //     }).dxButton('instance');
    //   });

    // initDeleteDraftButton = $(() => {
    //     let that = this;
    //     this.deleteDraftButton = $('#delete-draft').dxButton({
    //       text: 'Elimina bozza',
    //       icon: 'trash',
    //       type: 'danger',
    //       disabled: true,
    //       onClick() {
    //         that.loadPanel.show();
    //         setTimeout(() => {
    //             that.loadPanel.hide();
    //             let saveManager = new SaveManager();
    //             saveManager.deleteDraft(that.selectedPage.id);
    //             that.deleteDraftButton.option("disabled", true);
    //             that.publishButton.option("disabled", true);
    //             that.saveInDraftButton.option("disabled", true);
    //             that.selectedPage.drafts = null;
    //             localStorage.setItem("id", that.selectedPage.id);
    //             window.location.reload();
    //           }, 400);
    //         }
    //     }).dxButton('instance');
    //   });

    // initPublishButton = $(() => {
    //     this.publishButton = $('#publish-page').dxButton({
    //       text: 'Pubblica pagina',
    //       icon: 'upload',
    //       type: 'success',
    //       index: 1,
    //       disabled: true,
    //       onClick() {
    //         let saveManager = new SaveManager();
    //         saveManager.publishPage(id);
    //         that.deleteDraftButton.option("disabled", true);
    //         that.publishButton.option("disabled", true);
    //         that.saveInDraftButton.option("disabled", true);
    //         window.location.reload();
    //       },
    //     }).dxButton('instance');
    //   });

    showPagePreview = (page) => {
        document.getElementById("go-back").style.display = "block";
        document.getElementById("structure-button").style.display = "block";
        document.getElementById("info").style.display = "flex";
        document.getElementById("buttons").style.display = "block";
        let prev_button = document.getElementById("prev-page");
        this.setDefaultMode();
        this.fillPage(page.contents.widgets);
    }

    fillPage = (widgets) => {
        var totRows = this.calculateRows(widgets),
            totCols = this.calculateColumns(widgets),
            rows = new Array(),
            cols = new Array(),
            object = { ratio: 1 };
        for (var i = 0; i < totRows; i++) {
            rows.push(object);
        }
        for (var i = 0; i < totCols; i++) {
            cols.push(object);
        }
        let items = widgets.map(w => {
            return {
                location: [{
                    row: w.row,
                    col: w.column,
                    colspan: (w.columnSpan) ? w.columnSpan : 1,
                    rowspan: (w.rowSpan) ? w.rowSpan : 1
                }],
                html: this.handleWidget(w)
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

    calculateRows = (widgets) => {
        var totRows = 0;
        widgets.forEach((widget) => {
            var currentSpan = (!widget.rowSpan) ? 1 : widget.rowSpan
            totRows = ((widget.row + currentSpan) > totRows) ? (widget.row + currentSpan) : totRows;
        })
        return (totRows == 0) ? (totRows + 1) : totRows;
    }

    calculateColumns = (widgets) => {
        var totCols = 0;
        widgets.forEach((widget) => {
            var currentSpan = (!widget.columnSpan) ? 1 : widget.columnSpan;
            totCols = ((widget.column + currentSpan) > totCols) ? (widget.column + currentSpan) : totCols;
        })
        return (totCols == 0) ? (totCols + 1) : totCols;
    }

    handleWidget = (widget) => {
        var [container, elem, editButton, editButtonContainer] = [document.createElement('div'), this.handelWidgetType(widget), document.createElement('i'), document.createElement('div')];
        if (widget.style != null)
            elem = this.handleWidgetStyle(widget, elem);
        else
            elem = this.applyDefaultStyle(widget, elem);
        elem.classList.add("widget");
        editButtonContainer.classList.add('edit-button-container');
        editButtonContainer.appendChild(editButton);
        editButton.className = 'fas fa-wrench edit-icon fa-lg';
        $(editButton).attr("data-toggle", "modal");
        $(editButton).attr("data-target", "#edit-modal");
        editButton.addEventListener('click', () => {
            this.openModifyPanel(widget);
        })
        container.append(editButtonContainer, elem);
        return container;
    }

    handelWidgetType = (widget) => {
        switch (widget.type) {
            case 0:
                var textContainer = this.handleTextWidget(widget);
                return textContainer;
                break;
            case 1:
                var galleryContainer = this.handleGalleryWidget(widget);
                return galleryContainer;
                break;
            case 2:
                var videoContainer = this.handleVideoWidget(widget);
                return videoContainer;
                break;
            case 3:
                var pdfContainer = this.handlePdfWidget(widget);
                return pdfContainer;
                break;
            case 4:
                var tourContainer = this.handleTourWidget(widget);
                return tourContainer;
            case 5:
                var mapContainer = this.handleMapWidget(widget);
                return mapContainer;
            case 6:
                var webPageContainer = this.handleWebPageWidget(widget);
                return webPageContainer;
            case 101:
                var horizontalScrollGallery = this.handleHorizontalScrollGallery(widget);
                return horizontalScrollGallery;
            case 102:
                var gridGalleryContainer = this.handleGridGalleryWidget(widget);
                return gridGalleryContainer;
            default:
                var div = document.createElement("div");
                div.innerHTML = "widget to handle";
                return div;
        }
    }

    handleTextWidget = (widget) => {
        var div = document.createElement("div");
        div.innerHTML = widget.content.text.trim();
        return div;
    }

    handleGalleryWidget = (widget) => {
        var baseId = "g";
        var galleryContainer = document.createElement("div");
        var div = document.createElement("div");
        galleryContainer.classList.add("gallery-container");
        var id = this.generateId(baseId)
        div.id = id;
        setTimeout(() => {
            $("#" + id).dxGallery({
                dataSource: widget.content.source,
                height: "auto",
                width: "inherit",
                maxWidth: "inherit",
                loop: (widget.content.enableLoop) ? widget.content.enableLoop : false,
                slideshowDelay: (widget.content.slideShowDelay) ? widget.content.slideShowDelay : 2000,
                showNavButtons: (widget.content.showNavButtons) ? widget.content.showNavButtons : false,
                showIndicator: (widget.content.showIndicator) ? widget.content.showIndicator : false,
            }).dxGallery('instance');
        }, 100)
        galleryContainer.appendChild(div);
        setTimeout(() => {
            if (widget.text) {
                let text = document.createElement("div");
                text.innerHTML = widget.text?.value?.trim();
                this.handleTextPosition(widget, text);
                galleryContainer.appendChild(text);

            }
        }, 300)
        return galleryContainer;
    }

    handleVideoWidget = (widget) => {
        var videoContainer = document.createElement('div');
        var video = this.buildIframe(widget);
        const regExp = "/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/";
        var src = "https://www.youtube.com/embed/qC0vDKVPCrw";
        var video_url = new URL(src);
        if (src.match(regExp) || src.indexOf("www.youtube-nocookie") != -1) {
            video.allowFullscreen = "true";
            var youtube_video = handleVideo(widget, video_url, video);
            video.src = youtube_video;
        } else if (src.indexOf("player.vimeo" != -1)) {
            video.allowFullscreen = "true";
            var vimeo_video = this.handleVideo(widget, video_url, video);
            video.src = vimeo_video;
        } else {
            video.src = video_url;
        }
        videoContainer.appendChild(video);
        return videoContainer;
    }

    handlePdfWidget = (widget) => {
        var scrollable = true;
        var direction = 'x';
        if (scrollable) {
            var canvasContainer = this.handleScrollablePdf(widget, direction);
            return canvasContainer;
        } else {
            const url = '../docs/pdf.pdf';

            var canvas = document.createElement('canvas');
            var pdfToolbar = createpdfToolbar();

            canvas.id = 'pdf-render';
            ctx = canvas.getContext('2d');

            let pdfSettings = {
                pdfToolbar: pdfToolbar,
                pdfDoc: null,
                pageNum: 1,
                pageIsRendering: false,
                pageNumIsPending: null,
                scale: 1,
                myCanvas: canvas,
                myCtx: ctx
            }

            pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
                pdfSettings.pdfDoc = pdfDoc_;
                setTimeout(() => {
                    document.querySelector('#prev-page').addEventListener('click', () => {
                        showPrevPage(pdfSettings)
                    });
                    document.querySelector('#next-page').addEventListener('click', () => {
                        showNextPage(pdfSettings)
                    });
                    document.querySelector('#zoom-out').addEventListener('click', () => {
                        zoomOutPdf(pdfSettings);
                    });
                    document.querySelector('#zoom-in').addEventListener('click', () => {
                        zoomInPdf(pdfSettings);
                    });

                    renderPdfPage(null, pdfSettings);
                }, 200);
            });
            var pdfContainer = document.createElement("div");
            pdfSettings.myCanvas.style.margin = "0 auto";
            pdfSettings.myCanvas.style.display = "block";
            pdfContainer.appendChild(pdfToolbar);
            pdfContainer.appendChild(pdfSettings.myCanvas);
            return pdfContainer;
        }
    }

    handleScrollablePdf = (widget, direction) => {
        var canvasContainer = document.createElement('div');
        canvasContainer.classList.add(direction === 'y' ? 'vertical-pdf-scroll-container' : 'horizontal-pdf-scroll');
        canvasContainer.id = "canvas-container";
        const url = '../docs/pdf.pdf';
        var options = { scale: 1 };

        var renderScrollablePdfPage = (page) => {
            var viewPort = calculateViewport(widget, page, canvasContainer);
            var wrapper = document.createElement('div');
            wrapper.className = "canvas-wrapper";
            var canvas = document.createElement('canvas');
            canvas.className = "canvas-pdf-scrollable";
            var ctx = canvas.getContext('2d');
            var renderContext = {
                canvasContext: ctx,
                viewport: viewPort
            };

            setTimeout(() => {
                canvas.height = viewPort.height;
                canvas.width = viewPort.width;
                canvasContainer.appendChild(canvas);
                page.render(renderContext).promise.then(() => {

                })
            }, 200);
        };

        var calculateViewport = (widget, page, canvasContainer) => {
            var viewPort;
            if (widget.style.height || widget.style.width)
                viewPort = page.getViewport({ scale: canvasContainer.clientWidth / page.getViewport({ scale: 1 }).width });
            else {
                viewPort = page.getViewport({ scale: 1 })
            }
            return viewPort;
        };

        var renderScrollablePdfPages = (pdfDoc) => {
            for (var num = 1; num <= pdfDoc.numPages; num++) {
                pdfDoc.getPage(num).then(page => {
                    renderScrollablePdfPage(page);
                })
            };
        }

        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            setTimeout(() => {
                renderScrollablePdfPages(pdfDoc_);
            }, 200);
        });

        return canvasContainer;

    }

    renderPdfPage = (pagePending = null, pdfSettings) => {
        pdfSettings.pageIsRendering = true;
        scale = pdfSettings.scale;
        var pageToRender;
        if (pagePending) {
            pageToRender = pagePending;
        } else {
            pageToRender = pdfSettings.pageNum;
        }

        pdfSettings.pdfDoc.getPage(pageToRender).then(page => {
            var viewport = page.getViewport({ scale });
            pdfSettings.myCanvas.height = viewport.height;
            pdfSettings.myCanvas.width = viewport.width;

            const renderCtx = {
                canvasContext: pdfSettings.myCtx,
                viewport
            }

            page.render(renderCtx).promise.then(() => {
                pdfSettings.pageIsRendering = false;

                if (pdfSettings.pageNumIsPending) {
                    renderPdfPage(pdfSettings.pageNumIsPending, pdfSettings);
                    pdfSettings.pageNumIsPending = null;
                }
            });

            document.getElementById('page-num').textContent = pdfSettings.pageNum + ' / ' + pdfSettings.pdfDoc.numPages;
        });
    }

    queueRenderPage = (pdfSettings, num) => {
        if (pdfSettings.pageIsRendering) {
            pdfSettings.pageNumIsPending = num;
        } else {
            this.renderPdfPage(num, pdfSettings);
        }
    }

    showPrevPage = (pdfSettings) => {
        if (pdfSettings.pageNum <= 1)
            return
        pdfSettings.pageNum--;
        this.queueRenderPage(pdfSettings, pdfSettings.pageNum);
    }

    showNextPage = (pdfSettings) => {
        if (pdfSettings.pageNum >= pdfSettings.pdfDoc.numPages)
            return;
        pdfSettings.pageNum++;
        this.queueRenderPage(pdfSettings, pdfSettings.pageNum);
    }

    displayPage = (pdfSettings) => {
        pdfSettings.pdfDoc.getPage(pdfSettings.pageNum).then(() => {
            this.renderPdfPage(null, pdfSettings);
        })
    }

    zoomInPdf = (pdfSetting) => {
        pdfSetting.scale = pdfSetting.scale + 0.25;
        this.displayPage(pdfSetting);
    }

    zoomOutPdf = (pdfSetting) => {
        if (pdfSetting.scale <= 0.25)
            return;
        pdfSetting.scale = pdfSetting.scale - 0.25;
        this.displayPage(pdfSetting);
    }

    createpdfToolbar = () => {
        var pdfToolbar = document.createElement('div');
        pdfToolbar.className = 'pdf-toolbar';
        var prevButton = document.createElement('button'),
            nextButton = document.createElement('button'),
            zoomInButton = document.createElement('button'),
            zoomOutButton = document.createElement('button');
        prevButton.id = 'prev-page';
        nextButton.id = 'next-page';
        zoomInButton.id = 'zoom-in';
        zoomOutButton.id = 'zoom-out';
        var prevIcon = document.createElement('i'),
            nextIcon = document.createElement('i'),
            zoomInIcon = document.createElement('i'),
            zoomOutIcon = document.createElement('i');
        prevIcon.className = "fas fa-arrow-circle-left";
        nextIcon.className = "fas fa-arrow-circle-right";
        zoomInIcon.className = "fas fa-plus-circle";
        zoomOutIcon.className = "fas fa-minus-circle";
        prevButton.appendChild(prevIcon);
        nextButton.appendChild(nextIcon);
        zoomInButton.appendChild(zoomInIcon);
        zoomOutButton.appendChild(zoomOutIcon);
        var currPage = document.createElement('span');
        currPage.className = "pdf-page-info";
        currPage.id = 'page-num';
        pdfToolbar.append(prevButton, nextButton, currPage, zoomInButton, zoomOutButton);
        return pdfToolbar;
    }

    handleTourWidget = (widget) => {
        var sdkKey = 'qeyy42zwyfu5fwkrxas6i6qqd';
        var tourContainer = document.createElement('div');
        var tourIframe = this.buildIframe(widget);
        if (widget.content.responsive)
            tourIframe.style.width = "100%";

        setTimeout(() => {
            tourIframe.addEventListener('load', async function() {
                let sdk;
                try {
                    sdk = await tourIframe.contentWindow.MP_SDK.connect(
                        tourIframe,
                        sdkKey,
                        '3.8'
                    );
                } catch (e) {
                    console.log(e)
                }
            }, 1000)
        });

        tourContainer.appendChild(tourIframe);
        return tourContainer;
    }

    handleMapWidget = (widget) => {
        var mapContainer = document.createElement('div');
        var mapOptions;
        const position = { lat: widget.content.latitude, lng: widget.content.longitude };
        mapContainer.id = "map";
        mapOptions = {
            center: position,
            zoom: widget.content.zoom ? widget.content.zoom : 17
        };

        var map = new google.maps.Map(mapContainer, mapOptions);

        var marker = new google.maps.Marker({
            position: position,
            map
        });

        return mapContainer;
    }

    handleGridGalleryWidget = (widget) => {
        var gridGalleryContainer = document.createElement('div');
        gridGalleryContainer.classList.add('grid-gallery');
        if (widget.content.source) {
            widget.content.source.forEach(source => {
                var imageContainer = document.createElement('div'),
                    img = document.createElement('img');
                imageContainer.classList.add('image-item');
                img.src = 'https://www.w3schools.com/w3images/nature.jpg';
                imageContainer.appendChild(img);
                gridGalleryContainer.appendChild(imageContainer);
            })
        }
        return gridGalleryContainer;
    }

    handleWebPageWidget = (widget) => {
        var webPageContainer = document.createElement('div');
        var webPageIframe = this.buildIframe(widget);
        webPageIframe.src = widget.content.source[0];
        webPageContainer.appendChild(webPageIframe);
        return webPageContainer;
    }

    handleHorizontalScrollGallery = (widget) => {
        var base_id = "horizontal-gallery";
        var [gallery, galleryWrapper] = [document.createElement('div'), document.createElement('div')];
        gallery.classList.add('gallery');
        galleryWrapper.classList.add('gallery-container');
        galleryWrapper.id = this.generateId(base_id);;
        widget.content.source.forEach(source => {
            var [itemWrapper, item] = [document.createElement('div'), document.createElement('img')];
            itemWrapper.classList.add('item-gallery-image');
            item.src = 'https://www.w3schools.com/w3images/nature.jpg';
            itemWrapper.appendChild(item);
            galleryWrapper.appendChild(itemWrapper);
        });

        var navigationButton = this.createGalleryNavButtons(galleryWrapper.id);
        gallery.append(galleryWrapper, navigationButton);
        return gallery;
    }

    createGalleryNavButtons = (galleryId) => {
        var [span, leftArrow, rightArrow] = [document.createElement('span'), document.createElement('i'), document.createElement('i')];
        leftArrow.className = 'fas fa-xl fa-angle-left left-icon';
        rightArrow.className = 'fas fa-xl fa-angle-right right-icon';
        rightArrow.onclick = () => {
            document.getElementById(galleryId).scrollLeft += 300;
        }
        leftArrow.onclick = () => {
            document.getElementById(galleryId).scrollLeft -= 300;
        }
        span.append(leftArrow, rightArrow);
        return span;
    }

    handleVideo = (widget, video_url, video) => {
        if (widget.content.enableAutoplay) {
            if (video_url.searchParams.get('autoplay') != null)
                video_url.searchParams.set('autoplay', 1);
            else
                video_url.searchParams.append('autoplay', 1);
            video.allow = "autoplay";
        } else {
            if (video_url.searchParams.get('autoplay') != null)
                video_url.searchParams.set('autoplay', 0);
            else
                video_url.searchParams.append('autoplay', 0);
        }
        if (widget.content.disableControls) {
            if (video_url.searchParams.get('controls') != null)
                video_url.searchParams.set('controls', 0);
            else
                video_url.searchParams.append('controls', 0);
        } else {
            if (video_url.searchParams.get('controls') != null)
                video_url.searchParams.set('controls', 1)
            else
                video_url.searchParams.append('controls', 1);
        }
        if (widget.content.enableLoop) {
            if (video_url.searchParams.get('loop') != null)
                video_url.searchParams.set('loop', 1);
            else
                video_url.searchParams.append('loop', 1);
        } else {
            if (video_url.searchParams.get('loop') != null)
                video_url.searchParams.set('loop', 0);
            else
                video_url.searchParams.append('loop', 0);
        }

        return video_url;
    }

    buildIframe = (widget) => {
        var iframe = document.createElement('iframe');
        iframe.src = "https://my.matterport.com/show/?m=xx7GChUUBii";
        iframe.allowFullscreen = true;
        if (widget.type == 2) {
            iframe.style.width = widget.content.width ? widget.content.width : "100%";
            iframe.style.height = widget.content.height ? widget.content.height : "600px";
        } else {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        }
        iframe.style.border = "none";
        return iframe;
    }


    handleWidgetStyle = (widget, div) => {

        div.style.position = "relative";

        if (widget.type == 5 && !widget.style.height)
            div.style.height = '500px';

        if (widget.style.padding)
            div = this.handlePadding(widget, div);

        if (widget.style.margin)
            div = this.handleMargin(widget, div);

        if (widget.style.width)
            div.style.width = widget.style.width;

        if (widget.style.height)
            div.style.height = widget.style.height;

        if (widget.style.background)
            div.style.background = widget.style.background;

        if (widget.style.textColor)
            div.style.color = widget.style.textColor;

        if (widget.style.fontFamily)
            div.style.fontFamily = widget.style.textColor;

        if (widget.style.fontSize)
            div.style.fontSize = widget.style.fontSize;


        if (widget.style.borders) {
            div = this.handleBorders(widget, div);
        }

        return div;
    }

    handlePadding = (widget, div) => {
        if (widget.style.padding.top) {
            div.style.paddingTop = widget.style.padding.top;
        }
        if (widget.style.padding.right) {
            div.style.paddingRight = widget.style.padding.right;
        }
        if (widget.style.padding.bottom) {
            div.style.paddingBottom = widget.style.padding.bottom;
        }
        if (widget.style.padding.left) {
            div.style.paddingLeft = widget.style.padding.left;
        }
        if (widget.style.padding.total) {
            div.style.padding = widget.style.padding.total;
        }
        return div;
    }

    handleMargin = (widget, div) => {
        if (widget.style.margin.top) {
            div.style.marginTop = widget.style.margin.top;
        }
        if (widget.style.margin.right) {
            div.style.marginRight = widget.style.margin.right;
        }
        if (widget.style.margin.bottom) {
            div.style.marginBottom = widget.style.margin.bottom;
        }
        if (widget.style.margin.left) {
            div.style.marginLeft = widget.style.margin.left;
        }
        if (widget.style.margin.total) {
            div.style.margin = widget.style.margin.total;
        }
        return div;
    }

    handleBorders = (widget, div) => {
        widget.style.borders.forEach(border => {
            switch (border.type) {
                case 0:
                    div.style.border = border.style;
                    div.style.borderWidth = border.width;
                    div.style.borderColor = border.color;
                    break;
    
                case 1:
                    div.style.borderLeft = border.style;
                    div.style.borderWidth = border.width;
                    div.style.borderColor = border.color;
                    break;
    
                case 2:
                    div.style.borderRight = border.style;
                    div.style.borderWidth = border.width;
                    div.style.borderColor = border.color;
                    break;
    
                case 3:
                    div.style.borderTop = border.style;
                    div.style.borderWidth = border.width;
                    div.style.borderColor = border.color;
                    break;
    
                case 4:
                    div.style.borderBottom = border.style;
                    div.style.borderWidth = border.width;
                    div.style.borderColor = border.color;
                    break;
            }
        })

        return div;
    }

    handleTextPosition = (widget, text) => {
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

    applyDefaultStyle = (widget, div) => {
        switch (widget.type) {
            case 2:
                div.classList.add('video-container-default');
                return div;
            case 5:
                div.classList.add('map-container-default');
                return div;
                break;
            case 6:
                div.classList.add('web-page-container-default');
                return div;
            default:
                return div;
                break;
        }
    }

    setDefaultMode = () => {
        var editIcon = document.querySelectorAll('.edit-icon');
        if (editIcon) {
            editIcon.forEach((icon) => {
                icon.style.display = 'none';
            })
        }
        document.getElementById("history-container").style.display = "block";
        document.getElementById('page').classList.remove('page-structure');
        // document.getElementById('structure-icon').classList.remove('fa-eye');
        // document.getElementById('structure-icon').classList.add('fa-pen-to-square');
        document.getElementById("demo-container").style.display = "block";
        var structureButton = document.getElementById('structure-button');
        structureButton.style.display = 'block';
        this.showingStructure = false;
    }

    changeMode = () => {
        var widgets = document.querySelectorAll(".widget");
        var structureIcon = document.getElementById('structure-icon');
        if (this.showingStructure) {
            document.getElementById('page').classList.remove('page-structure');
            [].forEach.call(widgets, (widget) => {
                widget.classList.remove('structure');
            });
            this.changeEditIconsVisibility('none')
            // structureIcon.classList.remove('fa-eye');
            // structureIcon.classList.add('fa-pen-to-square');
            this.showingStructure = false;
        } else {
            document.getElementById('page').classList.add('page-structure');
            [].forEach.call(widgets, (widget) => {
                widget.classList.add('structure');
            });
            this.changeEditIconsVisibility('block');
            // structureIcon.classList.add('fa-eye');
            // structureIcon.classList.remove('fa-pen-to-square');
            this.showingStructure = true;
        }
    }

    changeEditIconsVisibility = (displayMode) => {
        document.querySelectorAll('.edit-icon').forEach(editIcon => {
            editIcon.style.display = displayMode;
        })
    }

    initHistoryButton()
    {
        document.getElementById('prev-page').addEventListener('click', () => {
            this.renderPreviousPage();
        })
    }

    renderPreviousPage()
    {
        if (this.historyManager.isHistoryEmpty())
            $(() => {
                DevExpress.ui.notify("Non sono state apportate delle modifiche");
            })
        else {
            this.selectedPage = this.historyManager.getPreviousPage();
            this.showPagePreview(this.selectedPage);
        }
    }

    openModifyPanel = (widget) => {
        let text_content_id = this.generateId("0-ta-");
        let text_id = this.generateId("value-")
        let temp_selected_page = JSON.parse(JSON.stringify(this.selectedPage));
        let modifyManager = new ModifyManager(widget, JSON.parse(JSON.stringify(this.selectedPage)), text_content_id, text_id);
        modifyManager.initPanel();

        document.getElementById("save-widget-changes-button").addEventListener("click", () => {
            let modifiedPage = modifyManager.getUpdatedPage();
            if (modifiedPage) {
                if (this.historyManager.isHistoryEmpty())
                    this.historyManager.updateHistory(this.selectedPage);
                this.historyManager.updateHistory(modifiedPage);
                this.selectedPage = this.historyManager.getLastPage();
                // this.saveInDraftButton.option('disabled', false);
                this.showPagePreview(this.selectedPage);
            }

        });
    }

    generateId = (id) => {
            while (this.generatedId.indexOf(id) > -1) {
                id = id + Math.floor((Math.random() * (10000 + 1 - 1)) + 1).toString();
            }
            this.generatedId.push(id);
            return id;
        }
}