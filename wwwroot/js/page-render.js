import ModifyManager from './modify-manager.js'
import HistoryManager from './history-manager.js';
import SaveManager from './requests.js';
import FormData from './formData.js';
import Widget from "./widget.js";
import DefaultContents from "./defaultContents.js";

export default class PageRender {

    pages;
    selectedPage;
    generatedId = [];
    metadataChanged = false;
    historyManager = new HistoryManager();
    isDraft = false;
    typingTimer;
    doneTypingInterval = 800;
    saveInDraftBtn;
    deleteDraftBtn;
    publishPageBtn;
    deletePageBtn;
    deleteLanguageBtn;
    responsiveBox;
    fallbackResponsiveBox;
    twoColEL = false;
    threeColEL = false;
    fourColEL = false;
    languages = [
        "it",
        "en",
        "es",
        "fr",
        "de"
    ]

    constructor(page, content) {
        if (page.drafts)
            this.isDraft = true;
        this.initInteractives(); // init interactives html elements
    }

    initEventListener() {
        // init up and down arrows to change row position taking from responsive box
        let containers = document.getElementsByClassName("arrows-container");
        if (containers) {
            while (containers.length > 0) {
                containers[0].parentNode.removeChild(containers[0]);
            }
        }
        let htmlItems = document.getElementById('responsive-box').firstChild.childNodes;
        htmlItems.forEach((item, index) => {
            if (index != htmlItems.length - 1) {
                let arrowsContainer = document.createElement('div');
                arrowsContainer.style.visibility = "hidden";
                arrowsContainer.className = "arrows-container";
                arrowsContainer.id = index;
                let arrowUp = document.createElement('i');
                arrowUp.className = "fa-solid fa-arrow-up-long";
                arrowUp.style.fontSize = "1.2em";
                let arrowDown = document.createElement('i');
                arrowDown.className = "fa-solid fa-arrow-down-long";
                arrowDown.style.fontSize = "1.2em";
                arrowsContainer.append(arrowUp, arrowDown);
                item.firstChild.insertBefore(arrowsContainer, item.firstChild.firstChild);
                item.addEventListener('mouseover', () => {
                    arrowsContainer.style.visibility = "visible";
                });
                item.addEventListener('mouseout', () => {
                    arrowsContainer.style.visibility = "hidden";
                });
                arrowUp.addEventListener('click', () => {
                   if (arrowUp.parentNode.id == 0) {
                       Swal.fire({
                           icon: 'info',
                           title: 'Attenzione',
                           text: 'Impossibile spostare in alto la prima riga',
                       });
                       return;
                   }
                   else {
                       let fromRow = parseInt(arrowUp.parentNode.id);
                       this.selectedPage.contents.widgets.forEach(widget => {
                           if (widget.row == (fromRow - 1))
                               widget.row ++;
                           else if (widget.row == fromRow)
                               widget.row --;
                       });
                       
                       this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
                       var totRows = this.calculateRows(this.selectedPage.contents.widgets),
                           totCols = this.calculateColumns(this.selectedPage.contents.widgets);
                       this.initFallbackRespondiveBox(totRows, totCols, false);
    
                       // replace the entire row taking from fallback responsivebox
                       let responsiveBoxCotnainer = document.getElementById('responsive-box'),
                           newFromRowDiv = document.getElementById('fallback-responsive-box').children[0].children[parseInt(arrowUp.parentNode.id)],
                           oldFromRowDiv = responsiveBoxCotnainer.children[0].children[parseInt(arrowUp.parentNode.id)],
                           oldToRowDiv = responsiveBoxCotnainer.children[0].children[parseInt(arrowUp.parentNode.id) - 1],
                           newToRowDiv = document.getElementById('fallback-responsive-box').children[0].children[parseInt(arrowUp.parentNode.id) - 1]
                       responsiveBoxCotnainer.children[0].replaceChild(newFromRowDiv, oldFromRowDiv);
                       responsiveBoxCotnainer.children[0].replaceChild(newToRowDiv, oldToRowDiv);
                       
                       this.responsiveBox._screenItems = this.fallbackResponsiveBox._screenItems;
    
                       // update main responsivebox screenItems
                       this.responsiveBox._screenItems = this.responsiveBox._screenItems.filter(screenItem => screenItem.location.row != parseInt(arrowUp.parentNode.id) && screenItem.location.row != parseInt(arrowUp.parentNode.id) - 1);
                       this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
                           if (screenItem.location.row == fromRow || screenItem.location.row == (fromRow - 1)) {
                               this.responsiveBox._screenItems.push(screenItem);
                           }
                       });
                       // reset fallback responsivebox screenItems
                       this.fallbackResponsiveBox._screenItems = null;
                       this.initEventListener();
                       
                    }
                });
                
                arrowDown.addEventListener('click', () => {
                    var totRows = this.calculateRows(this.selectedPage.contents.widgets),
                        totCols = this.calculateColumns(this.selectedPage.contents.widgets);
                    if (arrowDown.parentNode.id == totRows - 1) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Attenzione',
                            text: "Impossibile spostare in basso l'ultima riga",
                        });
                        return;
                    }
                    let fromRow = parseInt(arrowDown.parentNode.id);
                    this.selectedPage.contents.widgets.forEach(widget => {
                        if (widget.row == fromRow)
                            widget.row ++;
                        else if (widget.row == (fromRow + 1))
                            widget.row --;
                    });
                    this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
                    this.initFallbackRespondiveBox(totRows, totCols, false);
                    // replace the entire row taking from fallback responsivebox
                    let responsiveBoxCotnainer = document.getElementById('responsive-box'),
                        newFromRowDiv = document.getElementById('fallback-responsive-box').children[0].children[parseInt(arrowUp.parentNode.id)],
                        oldFromRowDiv = responsiveBoxCotnainer.children[0].children[parseInt(arrowUp.parentNode.id)],
                        oldToRowDiv = responsiveBoxCotnainer.children[0].children[parseInt(arrowUp.parentNode.id) + 1],
                        newToRowDiv = document.getElementById('fallback-responsive-box').children[0].children[parseInt(arrowUp.parentNode.id) + 1]
                    responsiveBoxCotnainer.children[0].replaceChild(newFromRowDiv, oldFromRowDiv);
                    responsiveBoxCotnainer.children[0].replaceChild(newToRowDiv, oldToRowDiv);
                    // update main responsivebox screenItems
                    this.responsiveBox._screenItems = this.responsiveBox._screenItems.filter(screenItem => screenItem.location.row != parseInt(arrowUp.parentNode.id) && screenItem.location.row != parseInt(arrowUp.parentNode.id) + 1);
                    this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
                        if (screenItem.location.row == fromRow || screenItem.location.row == (fromRow + 1)) {
                            this.responsiveBox._screenItems.push(screenItem);
                        }
                    });
                    // reset fallback responsivebox screenItems
                    this.fallbackResponsiveBox._screenItems = null;
                    this.initEventListener();
                })
            }
        });
        
        let that = this;
        let addIcon = document.getElementById('add-icon');

        addIcon.addEventListener('click', () => {
            this.showPresets();
            if (!this.twoColEL) {
                this.twoColEL = true;
                document.getElementById('two-column-preset').addEventListener('click', () => {that.applyPreset(2); })
            }
            if (!this.threeColEL) {
                this.threeColEL = true;
                document.getElementById('three-column-preset').addEventListener('click', () => {that.applyPreset(3) })
            }
            if (!this.fourColEL) {
                this.fourColEL = true;
                document.getElementById('four-column-preset').addEventListener('click', () => { that.applyPreset(4) })
            }
        });

        document.getElementById('go-back').addEventListener("click", () => {
            if (!this.historyManager.isHistoryEmpty()) {
                Swal.fire({
                    title: 'Sicuro di voler uscire ?',
                    text: 'Tutte le modifiche non salvate andranno perse',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "https://localhost:5001";
                    }
                });
            } else window.location.href = "https://localhost:5001";
        });
        let draggableWidgets = document.querySelectorAll('.widget-wrapper');
        draggableWidgets.forEach(draggableWidget => {
            draggableWidget.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData("text/plain", draggableWidget.getAttribute('value'));
            })
        });
    }

    initInteractives() {
        this.initSidebarCurtains();
        document.getElementById("widgets-list-button").addEventListener("click", () => {
            this.closeModifyPanel();
        });
    }

    reloadPage() {
        localStorage.clear();
        if (!this.historyManager.isHistoryEmpty()) {
            Swal.fire({
                title: 'Sicuro di voler uscire ?',
                icon: 'question',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
        else {
            window.location.reload();
        }
    }

    initSidebarCurtains() {
        document.getElementById("widgets-curtain-header").addEventListener('click', () => {
            if (document.getElementById("widgets-curtain").offsetHeight == 0) {
                document.getElementById("close-widgets-curtain").style.display = "block";
                document.getElementById("open-widgets-curtain").style.display = "none";
                document.getElementById("widgets-curtain").style.height = "560px";
                document.getElementById("widgets-curtain-header").style.boxShadow = "none";
                document.getElementById("close-metadata-curtain").style.display = "none";
                document.getElementById("open-metadata-curtain").style.display = "block";
                document.getElementById("metadata").style.height = "0";
                document.getElementById("metadata").style.overflow = "hidden";
                setTimeout(() => {
                    document.getElementById("metadata-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 1%)";
                }, 300)
            } else {
                document.getElementById("close-widgets-curtain").style.display = "none";
                document.getElementById("open-widgets-curtain").style.display = "block";
                document.getElementById("widgets-curtain").style.height = "0";
                document.getElementById("widgets-curtain").style.overflow = "hidden";
                setTimeout(() => {
                    document.getElementById("widgets-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
                }, 300)
            }
        });

        document.getElementById("metadata-curtain-header").addEventListener('click', () => {
            if (document.getElementById("metadata").offsetHeight == 0) {
                document.getElementById("close-metadata-curtain").style.display = "block";
                document.getElementById("open-metadata-curtain").style.display = "none";
                document.getElementById("metadata").style.height = "250px";
                document.getElementById("metadata-curtain-header").style.boxShadow = "none";
                document.getElementById("close-widgets-curtain").style.display = "none";
                document.getElementById("open-widgets-curtain").style.display = "block";
                document.getElementById("widgets-curtain").style.height = "0";
                document.getElementById("widgets-curtain").style.overflow = "hidden";
                setTimeout(() => {
                    document.getElementById("widgets-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
                }, 300)
            } else {
                document.getElementById("close-metadata-curtain").style.display = "none";
                document.getElementById("open-metadata-curtain").style.display = "block";
                document.getElementById("metadata").style.height = "0";
                document.getElementById("metadata").style.overflow = "hidden";
                setTimeout(() => {
                    document.getElementById("metadata-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 1%)";
                }, 300)
            }
        });

        document.getElementById("content-curtain-header").addEventListener('click', () => {
            if (document.getElementById("content-curtain").offsetHeight == 0) {
                document.getElementById("close-content-curtain").style.display = "block";
                document.getElementById("open-content-curtain").style.display = "none";
                document.getElementById("content-curtain").style.height = "auto";
                document.getElementById("content-curtain-header").style.boxShadow = "none";
                document.getElementById("close-text-curtain").style.display = "none";
                document.getElementById("open-text-curtain").style.display = "block";
                document.getElementById("text-curtain").style.height = "0";
                document.getElementById("text-curtain").style.overflow = "hidden";
                document.getElementById("text-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            } else {
                document.getElementById("close-content-curtain").style.display = "none";
                document.getElementById("open-content-curtain").style.display = "block";
                document.getElementById("content-curtain").style.height = "0";
                document.getElementById("content-curtain").style.overflow = "hidden";
                document.getElementById("content-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            }
        });

        document.getElementById("text-curtain-header").addEventListener('click', () => {
            if (document.getElementById("text-curtain").offsetHeight == 0) {
                document.getElementById("close-text-curtain").style.display = "block";
                document.getElementById("open-text-curtain").style.display = "none";
                document.getElementById("text-curtain").style.height = "auto";
                document.getElementById("text-curtain-header").style.boxShadow = "none";
                document.getElementById("close-content-curtain").style.display = "none";
                document.getElementById("open-content-curtain").style.display = "block";
                document.getElementById("content-curtain").style.height = "0";
                document.getElementById("content-curtain").style.overflow = "hidden";
                document.getElementById("content-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            } else {
                document.getElementById("close-text-curtain").style.display = "none";
                document.getElementById("open-text-curtain").style.display = "block";
                document.getElementById("text-curtain").style.height = "0";
                document.getElementById("text-curtain").style.overflow = "hidden";
                document.getElementById("text-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            }
        });

        document.getElementById("style-curtain-header").addEventListener('click', () => {
            if (document.getElementById("style-curtain").offsetHeight == 0) {
                document.getElementById("close-style-curtain").style.display = "block";
                document.getElementById("open-style-curtain").style.display = "none";
                document.getElementById("style-curtain").style.height = "auto";
                document.getElementById("style-curtain-header").style.boxShadow = "none";
                document.getElementById("close-events-curtain").style.display = "none";
                document.getElementById("open-events-curtain").style.display = "block";
                document.getElementById("events-curtain").style.height = "0";
                document.getElementById("events-curtain").style.overflow = "hidden";
                document.getElementById("events-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
                document.getElementById("close-mobile-style-curtain").style.display = "none";
                document.getElementById("open-mobile-style-curtain").style.display = "block";
                document.getElementById("mobile-style-curtain").style.height = "0";
                document.getElementById("mobile-style-curtain").style.overflow = "hidden";
                document.getElementById("mobile-style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            } else {
                document.getElementById("close-style-curtain").style.display = "none";
                document.getElementById("open-style-curtain").style.display = "block";
                document.getElementById("style-curtain").style.height = "0";
                document.getElementById("style-curtain").style.overflow = "hidden";
                document.getElementById("style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            }
        });

        document.getElementById("events-curtain-header").addEventListener('click', () => {
            if (document.getElementById("events-curtain").offsetHeight == 0) {
                document.getElementById("close-events-curtain").style.display = "block";
                document.getElementById("open-events-curtain").style.display = "none";
                document.getElementById("events-curtain").style.height = "auto";
                document.getElementById("events-curtain-header").style.boxShadow = "none";
                document.getElementById("close-style-curtain").style.display = "none";
                document.getElementById("open-style-curtain").style.display = "block";
                document.getElementById("style-curtain").style.height = "0";
                document.getElementById("style-curtain").style.overflow = "hidden";
                document.getElementById("style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
                document.getElementById("close-mobile-style-curtain").style.display = "none";
                document.getElementById("open-mobile-style-curtain").style.display = "block";
                document.getElementById("mobile-style-curtain").style.height = "0";
                document.getElementById("mobile-style-curtain").style.overflow = "hidden";
                document.getElementById("mobile-style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            } else {
                document.getElementById("close-events-curtain").style.display = "none";
                document.getElementById("open-events-curtain").style.display = "block";
                document.getElementById("events-curtain").style.height = "0";
                document.getElementById("events-curtain").style.overflow = "hidden";
                document.getElementById("events-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            }
        });

        document.getElementById("mobile-style-curtain-header").addEventListener('click', () => {
            if (document.getElementById("mobile-style-curtain").offsetHeight == 0) {
                document.getElementById("close-mobile-style-curtain").style.display = "block";
                document.getElementById("open-mobile-style-curtain").style.display = "none";
                document.getElementById("mobile-style-curtain").style.height = "auto";
                document.getElementById("mobile-style-curtain-header").style.boxShadow = "none";
                document.getElementById("close-style-curtain").style.display = "none";
                document.getElementById("open-style-curtain").style.display = "block";
                document.getElementById("style-curtain").style.height = "0";
                document.getElementById("style-curtain").style.overflow = "hidden";
                document.getElementById("style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
                document.getElementById("close-events-curtain").style.display = "none";
                document.getElementById("open-events-curtain").style.display = "block";
                document.getElementById("events-curtain").style.height = "0";
                document.getElementById("events-curtain").style.overflow = "hidden";
                document.getElementById("events-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            } else {
                document.getElementById("close-mobile-style-curtain").style.display = "none";
                document.getElementById("open-mobile-style-curtain").style.display = "block";
                document.getElementById("mobile-style-curtain").style.height = "0";
                document.getElementById("mobile-style-curtain").style.overflow = "hidden";
                document.getElementById("mobile-style-curtain-header").style.boxShadow = "0px 8px 4px -2px rgb(0 0 0 / 3%)";
            }
        });
    }

    renderPageById(pageId) {
        this.pages.forEach(page => {
            if (page.id == pageId) {
                page.contents = page.contents[0];
                page.contents.visibility = page.contents.visibility || page.contents.visibility == 0 ? page.contents.visibility : page.visibility;
                page.contents.description = page.contents.description ? page.contents.description : page.description;
                page.contents.slug = page.contents.slug ? page.contents.slug : page.slug;
                this.showPagePreview(page);
                this.selectedPage = page;

            }
        });
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

    openPageStream(fullPage, contentOrDraft) {
        this.loadPanel.show();
        setTimeout(() => {
            let page = JSON.parse(JSON.stringify(fullPage));
            page.contents = contentOrDraft;
            page.contents.visibility = page.contents.visibility || page.contents.visibility == 0 ? page.contents.visibility : page.visibility;
            page.contents.description = page.contents.description ? page.contents.description : page.description;
            page.contents.slug = page.contents.slug ? page.contents.slug : page.slug;
            this.showPagePreview(page);
            this.selectedPage = page;
            if (this.selectedPage.drafts)
                this.deleteDraftBtn.option("disabled", false);
            this.historyManager = new HistoryManager();
            this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
            this.initHistoryButton();
            this.loadPanel.hide();
        }, 400);
    }

    buttons = [
        { id: 1, name: 'Salva bozza', icon: 'box' },
        { id: 2, name: 'Elimina bozza', icon: 'trash' },
        { id: 3, name: 'Pubblica', icon: 'upload' },
    ];

    saveDraft = $(() => {
        let that = this;
        that.saveInDraftBtn = $('#save-draft-button').dxButton({
            stylingMode: 'contained',
            text: 'Salva bozza',
            type: 'default',
            disabled: true,
            width: 120,
            onClick() {
                that.loadPanel.show();
                setTimeout(() => {
                    that.loadPanel.hide();
                    if (that.historyManager.isHistoryEmpty() || that.historyManager.getHistoryLenght() == 1 && that.metadataChanged == false)
                        Swal.fire({
                            icon: 'info',
                            title: 'Attenzione',
                            text: 'Non ci sono modifiche da salvare',
                        });
                    else if (that.historyManager.isHistoryEmpty() && that.metadataChanged) {
                        let saveManager = new SaveManager();
                        saveManager.saveInDraft(that.selectedPage, that.selectedPage);
                        document.getElementById("status").innerHTML = "bozza";
                        document.getElementById("status").style.color = "#e03e0d";
                        that.isDraft = true;
                    }
                    else if (!that.historyManager.isHistoryEmpty() || that.metadataChanged) {
                        let saveManager = new SaveManager();
                        saveManager.saveInDraft(that.historyManager.getHistory());
                        that.historyManager.emptyHistory();
                        document.getElementById("prev-page").style.display = "none";
                        document.getElementById("status").innerHTML = "bozza";
                        document.getElementById("status").style.color = "#e03e0d";
                        that.isDraft = true;
                        that.saveInDraftBtn.option("disabled", true);
                        that.deleteDraftBtn.option("disabled", false);
                        that.publishPageBtn.option("disabled", false);
                    }
                }, 400);
            },
        }).dxButton('instance');
    });

    deleteDraft = $(() => {
        let that = this;
        that.deleteDraftBtn = $('#delete-draft-button').dxButton({
            stylingMode: 'contained',
            text: 'Elimina bozza',
            type: 'danger',
            disabled: true,
            width: 130,
            onClick() {
                if (that.isDraft == false) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Attenzione',
                        text: 'Non sono presenti bozze da salvare',
                    });
                    return;
                }
                Swal.fire({
                    title: 'Eliminare le bozze ?',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        that.loadPanel.show();
                        setTimeout(() => {
                            let lan = that.selectedPage.contents.language;
                            let saveManager = new SaveManager();
                            saveManager.deleteDraft(that.selectedPage.id);
                            window.location.reload();
                        }, 400);
                    }
                });
            },
        }).dxButton('instance');
    });

    publish = $(() => {
        let that = this;
        that.publishPageBtn = $('#publish-button').dxButton({
            stylingMode: 'contained',
            text: 'Pubblica',
            type: 'success',
            disabled: true,
            width: 120,
            onClick() {
                if (that.isDraft == false) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Errore',
                        text: 'Pagina già pubblicata',
                    })
                    return;
                }
                Swal.fire({
                    title: 'Pubblicare la pagina ?',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        that.loadPanel.show();
                        setTimeout(() => {
                            let saveManager = new SaveManager();
                            saveManager.publishPage(that.selectedPage.id);
                            window.location.reload();
                        }, 400);
                    }
                });
            },
        }).dxButton('instance');
    });

    deletePage = $(() => {
        let that = this;
        that.deletePageBtn = $('#delete-page-button').dxButton({
            stylingMode: 'contained',
            text: 'Elimina Pagina',
            type: 'danger',
            disabled: false,
            width: 120,
            onClick() {
                Swal.fire({
                    title: 'Eliminare la pagina ?',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        that.loadPanel.show();
                        setTimeout(() => {
                            let saveManager = new SaveManager();
                            saveManager.deletePage(that.selectedPage.id);
                            window.location.reload();
                        }, 400);
                    }
                });
            },
        }).dxButton('instance');
    });

    deleteLanguage = $(() => {
        let that = this;
        that.deleteLanguageBtn = $('#delete-language-button').dxButton({
            stylingMode: 'contained',
            text: 'Elimina Lingua',
            type: 'danger',
            disabled: false,
            width: 120,
            onClick() {
                Swal.fire({
                    title: 'Eliminare la lingua corrente ?',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        that.loadPanel.show();
                        setTimeout(() => {
                            let saveManager = new SaveManager();
                            saveManager.deleteLanguage(that.selectedPage.id, that.selectedPage.contents.language);
                            window.location.href = "https://localhost:5001";
                        }, 400);
                    }
                });
            },
        }).dxButton('instance');
    });

    showPagePreview(page) {
        document.getElementById("page-title").style.display = "block";
        document.getElementById("page-title").innerHTML = page.description;
        let formData = new FormData({}, page)
        $(() => {
            let items = [];
            var that = this;
            $.each( formData.metadataTab, function( key, value ) {
                if (key == "visibility")
                    items.push({dataField: key.toString(), editorType: 'dxRadioGroup', editorOptions: {items: formData.Visibility, value: (formData.Visibility[page.contents.visibility].value), valueExpr: 'value', displayExpr: 'text', layout: 'horizontal'}});
                else if (key != "language" && key != "description" && key != "slug" && key != "visibility")
                    items.push({dataField: key.toString(), validationRules: [{type: "required"}]});
                else if (key == "language") {
                    let index = page.contents.language ? formData.Language.findIndex( lan => lan.value == page.contents.language) : 0;
                    items.push({dataField: key.toString(), editorType: 'dxSelectBox', editorOptions: {items: formData.Language, value: formData.Language[index].value, valueExpr: 'value', displayExpr: 'text', disabled: key == "language" && !page.contents.language ? true : false}, validationRules: [{type: "required"}]});
                }
                else
                    items.push({dataField: key.toString()});
            },),
                $('#metadata').dxForm({
                    colCount: 1,
                    formData: formData.metadataTab,
                    items: items,
                    labelLocation: "left",
                    onFieldDataChanged: function (e) {
                        that.metadataChanged = true;
                        that.selectedPage.contents[e.dataField] = e.value;
                        that.historyManager.updateHistory(that.selectedPage);
                    }
                });
        });
        document.getElementById("go-back").style.display = "block";
        document.getElementById("info").style.display = "flex";
        document.getElementById("save-draft-button").style.display = "block";
        document.getElementById("delete-draft-button").style.display = "block";
        document.getElementById("publish-button").style.display = "block";
        document.getElementById("delete-page-button").style.display = "block";
        document.getElementById("delete-language-button").style.display = "block";
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("sidebar").style.marginTop = document.getElementById("navbar").clientHeight + 'px';
        this.setDefaultMode();
        this.fillPage(page.contents.widgets, false);
    }

    createDropzone(base_id, container, widget) {
        let that = this;
        if (base_id && container) {
            let widgetData = JSON.stringify(widget);
            container.addEventListener('dragstart', (e) => {
                container.style.zIndex = 1000;
                e.dataTransfer.setData("text/plain", JSON.stringify(widgetData));
            });
            container.addEventListener('dragend', () => {
                container.style.zIndex = 0;
            })
            container.ondragover = function(e) {
                e.preventDefault();
                container.style.backgroundColor = "#e4e4e4";
                container.style.opacity = "50%";
            };
            container.ondragleave = function() {
                container.style.backgroundColor = "#fff";
                container.style.opacity = "100%";
            };
            container.ondrop = function(event) {
                event.preventDefault();
                container.style.backgroundColor = "#fff";
                container.style.opacity = "100%";
                let widgetData = event.dataTransfer.getData("text");
                widgetData = JSON.parse(widgetData);
                that.replaceWidget(widget, widgetData);
                that.saveInDraftBtn.option('disabled', false);
            };
        }
        else if (base_id && !container) {
            let id = this.generateId(base_id);
            let dropzone = document.createElement('div');
            dropzone.classList.add("dropzone");
            dropzone.id= this.generateId('dz-');
            let dropText = document.createElement("p");
            dropText.innerHTML = "Rilascia qui il widget";
            dropText.style.fontStyle = "italic";
            dropzone.append(dropText);
            dropzone.ondragover = function(e) {
                e.preventDefault()
                dropzone.style.backgroundColor = "#e4e4e4";
                dropzone.style.opacity = "50%";
            }
            dropzone.ondragleave = function() {
                dropzone.style.backgroundColor = "#fff";
                dropzone.style.opacity = "100%";
            }
            dropzone.ondrop = function(event) {
                event.preventDefault();
                dropzone.style.backgroundColor = "#fff";
                dropzone.style.opacity = "100%";
                let widgetData = event.dataTransfer.getData("text");
                widgetData = JSON.parse(widgetData);
                that.replaceWidget(widget, widgetData);
            };
            this.saveInDraftBtn.option('disabled', false);
            return dropzone;
        } else {
            let dropzone = document.createElement('div');
            dropzone.classList.add("dropzone");
            dropzone.id= "dropzone";
            let addIcon = document.createElement("i");
            addIcon.id = "add-icon"
            addIcon.className = "fa-solid fa-circle-plus";
            addIcon.style.fontSize = "60px";
            let dropText = document.createElement("p");
            dropText.innerHTML = "Rilascia qui il widget o il preset";
            dropText.style.fontStyle = "italic";
            let dropzoneContent = document.createElement("div");
            dropzoneContent.id = "dropzone-content";
            let presets = document.getElementById('presets-container');
            presets.style.display = "none";
            dropzoneContent.append(addIcon, dropText, presets)
            dropzone.append(dropzoneContent);
            dropzone.ondragover = function(e) {
                e.preventDefault()
                dropzone.style.backgroundColor = "#e4e4e4";
                dropzone.style.opacity = "50%";
            }
            dropzone.ondragleave = function() {
                dropzone.style.backgroundColor = "#fff";
                dropzone.style.opacity = "100%";
            }
            dropzone.ondrop = function(event) {
                event.preventDefault();
                dropzone.style.backgroundColor = "#fff";
                dropzone.style.opacity = "100%";
                let widgetType = event.dataTransfer.getData("text");
                widgetType = JSON.parse(widgetType);
                if (typeof widgetType != 'number') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'In questa area è possibile aggiungere solo widget vuoti',
                    })
                    return;
                }
                that.addWidget(parseInt(widgetType));
            };
            this.saveInDraftBtn.option('disabled', false);
            return dropzone;
        }
    }

    fillPage(widgets) {
        var totRows = this.calculateRows(widgets),
            totCols = this.calculateColumns(widgets),
            rows = new Array(),
            cols = new Array(),
            object = { ratio: 1 };
        for (var i = 0; i < totRows + 1; i++) {
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

        let dropzone = this.createDropzone()

        items.push(
            {
                location: [{
                    row: totRows,
                    col: 0,
                    colspan: totCols,
                    rowspan: 1
                }],
                html: dropzone
            }
        )

        this.responsiveBox = $('#responsive-box').dxResponsiveBox({
            rows: rows,
            cols: cols,
            items: items,
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
            },
        }).dxResponsiveBox('instance');

        this.initEventListener();

    }

    calculateRows(widgets) {
        var totRows = 0;
        widgets.forEach((widget) => {
            var currentSpan = (!widget.rowSpan) ? 1 : widget.rowSpan
            totRows = ((widget.row + currentSpan) > totRows) ? (widget.row + currentSpan) : totRows;
        })
        return (totRows == 0) ? (totRows + 1) : totRows;
    }

    calculateColumns(widgets) {
        var totCols = 0;
        widgets.forEach((widget) => {
            var currentSpan = (!widget.columnSpan) ? 1 : widget.columnSpan;
            totCols = ((widget.column + currentSpan) > totCols) ? (widget.column + currentSpan) : totCols;
        })
        return (totCols == 0) ? (totCols + 1) : totCols;
    }

    handleWidget(widget) {
        var [container, elem, editButton, editButtonContainer] = [document.createElement('div'), this.handelWidgetType(widget), document.createElement('i'), document.createElement('div')];
        if (widget.style != null)
            elem = this.handleWidgetStyle(widget, elem);
        else
            elem = this.applyDefaultStyle(widget, elem);
        if (widget.text && widget.text.value) {
            let text = document.createElement("div");
            text.innerHTML = widget.text?.value?.trim();
            this.handleTextPosition(widget, text);
            elem.appendChild(text);
        }
        elem.classList.add("widget");
        editButtonContainer.classList.add('edit-button-container');
        editButtonContainer.appendChild(editButton);
        editButton.className = 'fas fa-wrench edit-icon fa-lg';

        let resizer = document.createElement("div");
        resizer.className = 'resizer';
        this.initResizeEvent(resizer, widget, elem);

        elem.setAttribute('draggable', true);
        container.append(elem, resizer);
        if (widget.type != 1000) {
            container.addEventListener('mouseover', () => {
                resizer.style.display = "block";
                // elem.style.opacity = "70%";  
                elem.classList.add('structure');
            });
            container.addEventListener('mouseout', () => {
                resizer.style.display = "none";
                // elem.style.opacity = "100%";
                elem.classList.remove('structure');
            });
            elem.addEventListener('click', () => {
                this.openModifyPanel(widget);
            })
        }
        return container;
    }

    initResizeEvent(resizer, widget, elem) {
        resizer.addEventListener('mousedown', (e) => {
            let besideWidget = this.selectedPage.contents.widgets.find(w => {return w.row == widget.row && w.column > widget.column}),
                pageColumns = this.calculateColumns(this.selectedPage.contents.widgets),
                startX = e.clientX,
                startWidth = parseInt(document.defaultView.getComputedStyle(elem).width, 10);
            document.documentElement.addEventListener('mousemove', (e) => {
                elem.style.width = (startWidth + e.clientX - startX) + 'px';
            }, false);
            document.documentElement.addEventListener('mouseup', (e) => {
                let oldElement = elem,
                    newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                let resizeRatio = newElement.clientWidth / startWidth,
                    newSpan = Math.round(widget.columnSpan * resizeRatio) != 0 ? Math.round(widget.columnSpan * resizeRatio) : 1,
                    currWidget = this.selectedPage.contents.widgets.find(w => {return w.row == widget.row && w.column == widget.column});
                if ((widget.column + newSpan) > pageColumns) {
                    newElement.style.width = startWidth;
                    this.fillPage(this.selectedPage.contents.widgets);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Non è possibile ingrandire oltre la larghezza della pagina',
                    })
                    return;
                }
                else if (besideWidget && (currWidget.column + newSpan) > besideWidget.column && besideWidget.type != 1000) {
                    newElement.style.width = startWidth;
                    this.fillPage(this.selectedPage.contents.widgets);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Non è possibile sovrapporre due elementi',
                    });
                    return;
                }
                else if (besideWidget && (currWidget.column + newSpan) > besideWidget.column && besideWidget.type == 1000) {
                    let oldWidgetSpan = currWidget.columnSpan;
                    this.selectedPage.contents.widgets.forEach(w => {
                        if (w.column == currWidget.column && w.row == currWidget.row)
                            currWidget.columnSpan = newSpan;
                    });
                    
                    // if new span equals to beside widget columns, delete beside widget
                    if ((currWidget.column + newSpan) >= (besideWidget.column + besideWidget.columnSpan)) {
                        let widgets = new Array();
                        this.selectedPage.contents.widgets.forEach(w => {
                            if (w.row != besideWidget.row || w.column != besideWidget.column)
                                widgets.push(w);
                        });
                        this.selectedPage.contents.widgets = widgets;
                    } else {
                        this.selectedPage.contents.widgets.forEach(w => {
                            if (w.row == besideWidget.row && w.column == besideWidget.column) {
                                let oldBesideWidgetColumns = besideWidget.column + besideWidget.columnSpan;
                                besideWidget.column = currWidget.column + newSpan;
                                besideWidget.columnSpan = oldBesideWidgetColumns - besideWidget.column;
                            }
                        });
                    }
                
                    this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
                    var totRows = this.calculateRows(this.selectedPage.contents.widgets),
                        totCols = this.calculateColumns(this.selectedPage.contents.widgets);
                    this.initFallbackRespondiveBox(totRows, totCols, false);

                    // replace the entire row taking from fallback responsivebox
                    let responsiveBoxCotnainer = document.getElementById('responsive-box'),
                        newRowDiv = document.getElementById('fallback-responsive-box').children[0].children[widget.row],
                        oldRowDiv = responsiveBoxCotnainer.children[0].children[widget.row];
                    responsiveBoxCotnainer.children[0].replaceChild(newRowDiv, oldRowDiv);


                    // update main responsivebox screenItems
                    this.responsiveBox._screenItems = this.responsiveBox._screenItems.filter(screenItem => screenItem.location.row != widget.row);
                    this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
                        if (screenItem.location.row == widget.row) {
                            this.responsiveBox._screenItems.push(screenItem);
                            this.initEventListener(resizer, widget, screenItem.item.html);
                        }
                    });


                    // reset fallback responsivebox screenItems
                    this.fallbackResponsiveBox._screenItems = null;
                }
                else {
                    if (besideWidget && besideWidget.type == 1000) {
                        widget.columnSpan = newSpan;
                        this.selectedPage.contents.widgets.forEach(w => {
                            if (w.row == besideWidget.row && w.column == besideWidget.column && w.columnSpan == besideWidget.columnSpan) {
                                let oldBesideWidgetColumn = besideWidget.column;
                                let oldBesideWidgetColumnSpan = besideWidget.columnSpan;
                                w.column = widget.column + newSpan;
                                w.columnSpan = oldBesideWidgetColumnSpan + (oldBesideWidgetColumn - (widget.column + widget.columnSpan));
                                console.log("sdlfjg ", this.selectedPage.contents.widgets)
                            }
                        })
                    } else {
                        let oldColSpan = widget.columnSpan;
                        widget.columnSpan = newSpan;
                        let dropzoneCol = widget.column + newSpan;
                        let dropzoneRow = widget.row;
                        let dropzoneColSpan = (widget.column + oldColSpan) - dropzoneCol;
                        let dropzoneWidget = new Widget().getEmptyWidget();
                        dropzoneWidget.row = dropzoneRow;
                        dropzoneWidget.column = dropzoneCol;
                        dropzoneWidget.columnSpan = dropzoneColSpan;
                        dropzoneWidget.type = 1000;
                        this.selectedPage.contents.widgets.push(dropzoneWidget);
                    }
                    this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
                    var totRows = this.calculateRows(this.selectedPage.contents.widgets),
                        totCols = this.calculateColumns(this.selectedPage.contents.widgets);
                    this.initFallbackRespondiveBox(totRows, totCols, false);

                    // replace the entire row taking from fallback responsivebox
                    let responsiveBoxCotnainer = document.getElementById('responsive-box'),
                        newRowDiv = document.getElementById('fallback-responsive-box').children[0].children[widget.row],
                        oldRowDiv = responsiveBoxCotnainer.children[0].children[widget.row];
                    responsiveBoxCotnainer.children[0].replaceChild(newRowDiv, oldRowDiv);


                    // update main responsivebox screenItems
                    this.responsiveBox._screenItems = this.responsiveBox._screenItems.filter(screenItem => screenItem.location.row != widget.row);
                    this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
                        if (screenItem.location.row == widget.row) {
                            this.responsiveBox._screenItems.push(screenItem);
                            this.initEventListener(resizer, widget, screenItem.item.html);
                        }
                    });


                    // reset fallback responsivebox screenItems
                    this.fallbackResponsiveBox._screenItems = null;
                }
            }, false);
        } , false);
    }

    handelWidgetType(widget) {
        switch (widget.type) {
            case 0:
                var textContainer = this.handleTextWidget(widget);
                this.createDropzone('w-dz', textContainer, widget);
                return textContainer;
                break;
            case 1:
                var galleryContainer = this.handleGalleryWidget(widget);
                this.createDropzone('w-dz', galleryContainer, widget);
                return galleryContainer;
                break;
            case 2:
                var videoContainer,
                    videoContainer = this.handleVideoWidget(widget),
                    overlay = document.createElement("div");
                overlay.style.display = "block"
                overlay.classList.add('iframe-overlay');
                let modifyIcon = document.createElement("i");
                modifyIcon.className = "fa-solid fa-gear";
                videoContainer.appendChild(overlay);
                this.createDropzone('w-dz', videoContainer, widget);
                videoContainer.onmouseover = function() {
                    videoContainer.style.opacity = "80%";
                }
                videoContainer.onmouseout = function() {
                    overlay.style.zIndex = "2";
                    videoContainer.style.opacity = "100%";
                }
                return videoContainer;
                break;
            case 3:
                var pdfContainer = this.handlePdfWidget(widget);
                this.createDropzone('w-dz', pdfContainer, widget);
                return pdfContainer;
                break;
            case 4:
                var tourContainer = this.handleTourWidget(widget),
                    tourOverlay = document.createElement("div");
                tourOverlay.style.display = "block";
                tourOverlay.classList.add('iframe-overlay');
                let tourModifyIcon = document.createElement("i");
                tourModifyIcon.className = "fa-solid fa-gear";
                this.createDropzone('w-dz', tourContainer, widget);
                tourContainer.appendChild(tourOverlay);
                tourContainer.addEventListener('mouseover', function() {
                    tourContainer.style.opacity = "80%";
                });
                tourContainer.addEventListener('mouseout', function() {
                    tourOverlay.style.zIndex = "2";
                    tourContainer.style.opacity = "100%";
                });
                return tourContainer;
            case 5:
                var mapContainer = this.handleMapWidget(widget);
                this.createDropzone('w-dz', mapContainer, widget);
                return mapContainer;
            case 6:
                var webPageContainer = this.handleWebPageWidget(widget),
                    pageOverlay = document.createElement("div");
                pageOverlay.style.display = "block"
                pageOverlay.classList.add("iframe-overlay");
                let pageModifyIcon = document.createElement("i");
                pageModifyIcon.className = "fa-solid fa-gear";
                this.createDropzone('w-dz', webPageContainer, widget);
                webPageContainer.appendChild(pageOverlay);
                webPageContainer.addEventListener('mouseover', function() {
                    webPageContainer.style.opacity = "80%";
                });
                webPageContainer.addEventListener('mouseout', function() {
                    pageOverlay.style.zIndex = "2";
                    webPageContainer.style.opacity = "100%";
                });
                return webPageContainer;
            case 101:
                var horizontalScrollGallery = this.handleHorizontalScrollGallery(widget);
                this.createDropzone('w-dz', horizontalScrollGallery, widget);
                return horizontalScrollGallery;
            case 102:
                var gridGalleryContainer = this.handleGridGalleryWidget(widget);
                this.createDropzone('w-dz', gridGalleryContainer, widget);
                return gridGalleryContainer;
            case 1000:
                let dropzone = this.createDropzone('dz', null, widget);
                return dropzone;
            default:
                var div = document.createElement("div");
                div.innerHTML = "widget to handle";
                return div;
        }
    }

    handleTextWidget(widget) {
        var div = document.createElement("div");
        div.innerHTML = widget.content.text.trim();
        return div;
    }

    handleGalleryWidget(widget) {
        var baseId = "g",
            galleryContainer = document.createElement("div"),
            div = document.createElement("div"),
            id = this.generateId(baseId);
        galleryContainer.classList.add("gallery-container");
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
        }, 100);
        galleryContainer.appendChild(div);
        return galleryContainer;
    }

    handleVideoWidget(widget) {
        var videoContainer = document.createElement('div'),
            video = this.buildIframe(widget),
            src = widget.content.source[0],
            video_url = new URL(src);
        const regExp = "/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/";

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
        let overlay = document.createElement('div');
        overlay.style.width = videoContainer.offsetWidth + 'px';
        overlay.style.height = videoContainer.offsetHeight + 'px';
        videoContainer.append(overlay, video);
        return videoContainer;
    }

    handlePdfWidget(widget) {
        var scrollable = true;
        var direction = 'x';
        if (scrollable) {
            var canvasContainer = this.handleScrollablePdf(widget, direction);
            return canvasContainer;
        } else {
            const url = 'https://api.b2b.flowers.usalesman.it/api/v1/media/public/blobs/artnova/catalog.pdf';

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

    handleScrollablePdf(widget, direction) {
        var canvasContainer = document.createElement('div');
        canvasContainer.classList.add(direction === 'y' ? 'vertical-pdf-scroll-container' : 'horizontal-pdf-scroll');
        canvasContainer.id = "canvas-container";
        const url = 'https://api.b2b.flowers.usalesman.it/api/v1/media/public/blobs/artnova/catalog.pdf';
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

    renderPdfPage(pagePending = null, pdfSettings) {
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

    queueRenderPage(pdfSettings, num) {
        if (pdfSettings.pageIsRendering) {
            pdfSettings.pageNumIsPending = num;
        } else {
            this.renderPdfPage(num, pdfSettings);
        }
    }

    showPrevPage(pdfSettings) {
        if (pdfSettings.pageNum <= 1)
            return
        pdfSettings.pageNum--;
        this.queueRenderPage(pdfSettings, pdfSettings.pageNum);
    }

    showNextPage(pdfSettings) {
        if (pdfSettings.pageNum >= pdfSettings.pdfDoc.numPages)
            return;
        pdfSettings.pageNum++;
        this.queueRenderPage(pdfSettings, pdfSettings.pageNum);
    }

    displayPage(pdfSettings) {
        pdfSettings.pdfDoc.getPage(pdfSettings.pageNum).then(() => {
            this.renderPdfPage(null, pdfSettings);
        })
    }

    zoomInPdf(pdfSetting) {
        pdfSetting.scale = pdfSetting.scale + 0.25;
        this.displayPage(pdfSetting);
    }

    zoomOutPdf(pdfSetting) {
        if (pdfSetting.scale <= 0.25)
            return;
        pdfSetting.scale = pdfSetting.scale - 0.25;
        this.displayPage(pdfSetting);
    }

    createpdfToolbar() {
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

    handleTourWidget(widget) {
        var sdkKey = 'qeyy42zwyfu5fwkrxas6i6qqd',
            tourContainer = document.createElement('div'),
            tourIframe = this.buildIframe(widget);
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

    handleMapWidget(widget) {
        var mapContainer = document.createElement('div'),
            mapOptions;
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

    handleGridGalleryWidget(widget) {
        var gridGalleryContainer = document.createElement('div');
        gridGalleryContainer.classList.add('grid-gallery');
        if (widget.content.source) {
            widget.content.source.forEach(source => {
                var imageContainer = document.createElement('div'),
                    img = document.createElement('img');
                imageContainer.classList.add('image-item');
                img.src = '../../../assets/images/image.jpg';
                imageContainer.appendChild(img);
                gridGalleryContainer.appendChild(imageContainer);
            })
        }
        return gridGalleryContainer;
    }

    handleWebPageWidget(widget) {
        var webPageContainer = document.createElement('div'),
            webPageIframe = this.buildIframe(widget);
        webPageIframe.src = widget.content.source[0];
        webPageContainer.appendChild(webPageIframe);
        return webPageContainer;
    }

    handleHorizontalScrollGallery(widget) {
        var base_id = "horizontal-gallery",
            [gallery, galleryWrapper] = [document.createElement('div'), document.createElement('div')];
        gallery.classList.add('gallery');
        galleryWrapper.classList.add('gallery-container');
        galleryWrapper.id = this.generateId(base_id);;
        widget.content.source.forEach(source => {
            var [itemWrapper, item] = [document.createElement('div'), document.createElement('img')];
            itemWrapper.classList.add('item-gallery-image');
            item.src = '../../../assets/images/image.jpg';
            itemWrapper.appendChild(item);
            galleryWrapper.appendChild(itemWrapper);
        });

        var navigationButton = this.createGalleryNavButtons(galleryWrapper.id);
        gallery.append(galleryWrapper, navigationButton);
        return gallery;
    }

    createGalleryNavButtons(galleryId) {
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

    handleVideo(widget, video_url, video) {
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

    buildIframe(widget) {
        let that = this;
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


    handleWidgetStyle(widget, div) {

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

    handlePadding(widget, div) {
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

    handleMargin(widget, div) {
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

    handleBorders(widget, div) {
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

    handleTextPosition(widget, text) {
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
            text.style.left = widget.text.position.left;s
        }
    }

    applyDefaultStyle(widget, div) {
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

    setDefaultMode() {
        var editIcon = document.querySelectorAll('.edit-icon');
        if (editIcon) {
            editIcon.forEach((icon) => {
                icon.style.display = 'none';
            })
        }
        document.getElementById("history-container").style.display = "block";
        document.getElementById("demo-container").style.display = "block";
    }

    generateId(id) { // for all html elements which need an id
        while (this.generatedId.indexOf(id) > -1) {
            id = id + '-' + Math.floor((Math.random() * (10000 + 1 - 1)) + 1).toString();
        }
        this.generatedId.push(id);
        return id;
    }

    initHistoryButton() {
        let that = this;
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'z') {
                that.closeModifyPanel();
                that.renderPreviousPage();
            }
        });
        document.getElementById('prev-page').addEventListener('click', () => {
            this.closeModifyPanel();
            this.renderPreviousPage();
        })
    }

    renderPreviousPage() {
        if (this.historyManager.isHistoryEmpty() || (this.historyManager.getHistoryLenght()) == 1)
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Non presenti delle modifiche in questa sessione',
            });

        else {
            this.selectedPage = JSON.parse(JSON.stringify(this.historyManager.getPreviousPage()));
            this.fillPage(this.selectedPage.contents.widgets)
        }
    }

    openModifyPanel(widget) {
        document.getElementById("sidebar-default-view").style.display = "none";
        document.getElementById("sidebar-edit-view").style.display = "block";
        let text_content_id = this.generateId("0-ta-"),
            text_id = this.generateId("value-"),
            temp_selected_page = JSON.parse(JSON.stringify(this.selectedPage)),
            modifyManager = new ModifyManager(widget, JSON.parse(JSON.stringify(this.selectedPage)), text_content_id, text_id, this);
        this.loadPanel.show();
        modifyManager.initPanel();
        this.loadPanel.hide();
    }

    closeModifyPanel() {
        document.getElementById("sidebar-edit-view").style.display = "none";
        document.getElementById("sidebar-default-view").style.display = "block";
    }

    renderWidgetChanges(widget, modifiedPage) {
        this.responsiveBox._screenItems.forEach(screenItem => {
            if (screenItem.location.row == widget.row && screenItem.location.col == widget.column) {
                modifiedPage = JSON.parse(JSON.stringify(modifiedPage)); // to delete reference
                let oldNode = screenItem.item.html;
                let newNode = this.handleWidget(widget);
                let oldNodeParent = oldNode.parentNode;
                oldNodeParent.innerHTML = "";
                oldNodeParent.appendChild(newNode);
                screenItem.item.html = newNode;
            }
        });
        this.historyManager.updateHistory(JSON.parse(JSON.stringify(modifiedPage)));
        this.selectedPage = this.historyManager.getLastPage();
        this.initEventListener();
    }

    showPresets() {
        let presets = document.getElementById('presets-container');
        let dropzone = document.getElementById('dropzone');
        document.getElementById("dropzone-content").style.display = "none";
        presets.style.display = "block";
        dropzone.appendChild(presets);
    }

    hidePresets() {
        let presets = document.getElementById('presets-container');
        let dropzone = document.getElementById('dropzone');
        presets.style.display = "none";
        document.getElementById("dropzone-content").style.display = "block";
    }

    applyPreset(colNumber) {
        this.hidePresets();
        let cols = 0;
        let rows = 0;
        if (this.selectedPage.contents.widgets.length != 0) {
            cols = this.calculateColumns(this.selectedPage.contents.widgets);
            rows = this.calculateRows(this.selectedPage.contents.widgets);
            this.responsiveBox._screenItems.forEach(screenItem => {
                if (screenItem.location.row == rows)
                    screenItem.location.row++;
            })
        }
        if (colNumber != cols) {
            this.adaptPage(colNumber, cols, rows);
        } else {
            for(let i = 0; i < cols; i++) {
                let newWidget = new Widget().getEmptyWidget();
                newWidget.row = rows;
                newWidget.column = i;
                newWidget.type = 1000;
                this.selectedPage.contents.widgets.push(newWidget);
            }
        }
        this.initEventListener();
    }

    adaptPage(colNumber, cols, rows) {
        let that = this;
        if (cols % colNumber == 0 || colNumber % cols == 0) {
            if (colNumber < cols) {
                for (let i = 0; i < colNumber; i++) {
                    let newWidget = new Widget().getEmptyWidget();
                    newWidget.row = rows;
                    newWidget.column = i * (cols / colNumber);
                    newWidget.columnSpan = (cols / colNumber);
                    newWidget.type = 1000;
                    that.selectedPage.contents.widgets.push(newWidget);
                }
            } else {
                that.selectedPage.contents.widgets.forEach(w => {
                    w.columnSpan = (w.columnSpan) ? w.columnSpan : 1;
                    w.columnSpan *= (colNumber / cols);
                    if (w.column != 0)
                        w.column = (w.column * w.columnSpan);
                });
                for (let i = 0; i < colNumber; i++) {
                    let newWidget = new Widget().getEmptyWidget();
                    newWidget.row = rows;
                    newWidget.column = i;
                    newWidget.type = 1000;
                    that.selectedPage.contents.widgets.push(newWidget);
                }
            }
        } else {
            let temp = colNumber;
            while (temp % cols != 0) {
                temp += colNumber;
            }
            this.selectedPage.contents.widgets.forEach(w => {
                w.columnSpan = w.columnSpan ? w.columnSpan * (temp / cols) : 1 * (temp / cols);
                w.column =  w.column ? (w.column * temp) / cols : w.column;
            });
            for (let i = 0; i < colNumber; i++) {
                let newWidget = new Widget().getEmptyWidget();
                newWidget.row = rows;
                newWidget.column = i * (temp / colNumber);
                newWidget.columnSpan = (temp / colNumber);
                newWidget.type = 1000;
                that.selectedPage.contents.widgets.push(newWidget);
            }
        }

        var totRows = this.calculateRows(this.selectedPage.contents.widgets);
        var totCols = this.calculateColumns(this.selectedPage.contents.widgets);
        this.initFallbackRespondiveBox(totRows, totCols);
        this.responsiveBox._screenItems[this.responsiveBox._screenItems.length - 1].location.row = totRows;
        let lastScreenItem = this.responsiveBox._screenItems.pop();
        this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
            screenItem.location.row = totRows - 1;
            screenItem.item.location[0].row = totRows - 1;
            this.responsiveBox._screenItems.push(screenItem);
        });
        lastScreenItem.location.row = totRows;
        this.responsiveBox._screenItems.push(lastScreenItem);

        this.fallbackResponsiveBox._screenItems = [];

        let newRowNode = document.getElementById('fallback-responsive-box').firstChild.lastChild

        document.getElementById('responsive-box').firstChild.insertBefore(newRowNode, document.getElementById('responsive-box').firstChild.lastChild);
    }

    replaceWidget(toWidget, widgetData) {
        if (typeof widgetData == 'number') {
            let emptyWidget = new Widget().getEmptyWidget();
            emptyWidget.type = widgetData;
            let defaultContents = new DefaultContents();
            switch (emptyWidget.type) {
                case 0:
                    emptyWidget.content = defaultContents.textContent;
                    emptyWidget.style = {padding: {top: "30px", bottom: "30px"}};
                    break;
                case 1:
                    emptyWidget.content = defaultContents.gallerySource;
                    break;
                case 2:
                    emptyWidget.content = defaultContents.videoSource;
                    break;
                case 3:
                    emptyWidget.content = defaultContents.pdfSource;
                    break;
                case 4:
                    emptyWidget.content = defaultContents.showcaseSource;
                    break;
                case 5:
                    emptyWidget.content = defaultContents.mapContent;
                    break;
                case 6:
                    var totRows = this.calculateRows(this.selectedPage.contents.widgets);
                    var totCols = this.calculateColumns(this.selectedPage.contents.widgets);
                    //this.initFallbackRespondiveBox(totRows, totCols)
                    emptyWidget.content = defaultContents.webPageSource;
                    break;
                case 101:
                case 102:
                    emptyWidget.content = defaultContents.horizontalAndGridGallerySource;
                    break;
                case 1000:
                    emptyWidget = emptyWidget;
                    break;
            }

            emptyWidget.row = toWidget.row;
            emptyWidget.column = toWidget.column;
            emptyWidget.columnSpan = toWidget.columnSpan;

            let oldWidgetIndex = this.selectedPage.contents.widgets.findIndex(w => w.row == toWidget.row && w.column == toWidget.column)
            this.selectedPage.contents.widgets[oldWidgetIndex] = emptyWidget;
            this.renderWidgetChanges(emptyWidget, this.selectedPage);
        }
        else {
            widgetData = JSON.parse(widgetData);
            if (toWidget.row != widgetData.row || toWidget.column != widgetData.column) {
                Swal.fire({
                    title: 'Sostituire il widget ?',
                    icon: 'question',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Si',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let toWidgetIndex = this.selectedPage.contents.widgets.findIndex(w => w.row == toWidget.row && w.column == toWidget.column);
                        this.selectedPage.contents.widgets[toWidgetIndex] = widgetData;
                        this.selectedPage.contents.widgets[toWidgetIndex].row = toWidget.row;
                        this.selectedPage.contents.widgets[toWidgetIndex].column = toWidget.column;
                        this.selectedPage.contents.widgets[toWidgetIndex].columnSpan = toWidget.columnSpan;
                        this.renderWidgetChanges(this.selectedPage.contents.widgets[toWidgetIndex], this.selectedPage);
                    }
                });
            }
        }
    }

    addWidget(widgetType, row, column, span) {
        let emptyWidget = new Widget().getEmptyWidget();
        emptyWidget.type = widgetType;
        let defaultContents = new DefaultContents();
        switch (emptyWidget.type) {
            case 0:
                emptyWidget.content = defaultContents.textContent;
                emptyWidget.style = {padding: {top: "30px", bottom: "30px"}};
                break;
            case 1:
                emptyWidget.content = defaultContents.gallerySource;
                break;
            case 2:
                emptyWidget.content = defaultContents.videoSource;
                break;
            case 3:
                emptyWidget.content = defaultContents.pdfSource;
                break;
            case 4:
                emptyWidget.content = defaultContents.showcaseSource;
                break;
            case 5:
                emptyWidget.content = defaultContents.mapContent;
                break;
            case 6:
                emptyWidget.content = defaultContents.webPageSource;
                emptyWidget.style.height = "1100px";
                break;
            case 101:
            case 102:
                emptyWidget.content = defaultContents.horizontalAndGridGallerySource;
                break;
            case 1000:
                emptyWidget = emptyWidget;
                break;
        }
        if (span) {
            emptyWidget.row = row;
            emptyWidget.column = column;
            emptyWidget.columnSpan = span;
            this.selectedPage = JSON.parse(JSON.stringify(this.selectedPage))
            this.selectedPage.contents.widgets.push(emptyWidget);
        }
        else if (row || row == 0 && column || column == 0) {
            this.selectedPage.contents.widgets.forEach(widget => {
                if (widget.row == row && widget.column == column) {
                    widget.type = widgetType;
                    widget.content = emptyWidget.content;
                }
            });
        } else {
            let pageRows = this.calculateRows(this.selectedPage.contents.widgets);
            let pageColumns = this.calculateColumns(this.selectedPage.contents.widgets);
            emptyWidget.row = pageRows;
            emptyWidget.column = 0;
            emptyWidget.columnSpan = pageColumns;
            if (span)
                emptyWidget.columnSpan = span;
            this.selectedPage.contents.widgets.push(emptyWidget);
        }
        var totRows = this.calculateRows(this.selectedPage.contents.widgets);
        var totCols = this.calculateColumns(this.selectedPage.contents.widgets);
        this.initFallbackRespondiveBox(totRows, totCols);
        this.responsiveBox._screenItems[this.responsiveBox._screenItems.length - 1].location.row = totRows;
        let lastScreenItem = this.responsiveBox._screenItems.pop();
        this.fallbackResponsiveBox._screenItems.forEach(screenItem => {
            screenItem.location.row = totRows - 1;
            screenItem.item.location[0].row = totRows - 1;
            this.responsiveBox._screenItems.push(screenItem);
        });
        lastScreenItem.location.row  = totRows;
        this.responsiveBox._screenItems.push(lastScreenItem);
        this.fallbackResponsiveBox._screenItems = [];
        let newRowNode = document.getElementById('fallback-responsive-box').firstChild.lastChild
        document.getElementById('responsive-box').firstChild.insertBefore(newRowNode, document.getElementById('responsive-box').firstChild.lastChild);
        this.historyManager.updateHistory(JSON.parse(JSON.stringify(this.selectedPage)));
        this.initEventListener();
    }

    initFallbackRespondiveBox(rows, cols, append) {
        var totRows = rows;
        var totCols = cols;
        let rbRows = new Array();
        let rbCols = new Array();
        var object = { ratio: 1 };
        for (var i = 0; i < totCols; i++) {
            rbCols.push(object);
        }
        for (var i = 0; i < totRows; i++) {
            rbRows.push(object);
        }

        let items = this.selectedPage.contents.widgets.map(w => {
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

        let filteredItems = items.filter(item => item.location[0].row == totRows - 1)

        this.fallbackResponsiveBox = $('#fallback-responsive-box').dxResponsiveBox({
            rows: rbRows,
            cols: rbCols,
            items: append ? filteredItems : items,
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
            },
        }).dxResponsiveBox('instance');
    }

}