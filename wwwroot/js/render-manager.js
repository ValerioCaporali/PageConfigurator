import ModifyManager from './modify-manager.js'
import HistoryManager from './history-manager.js';
import SaveManager from './save-manager.js';
import FormData from './formData.js';
import Widget from "./widget.js";
import DefaultContents from "./defaultContents.js";
export default class RenderManager {

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
    responsiveBox;
    twoColEL = false;
    threeColEL = false;
    fourColEL = false;

    constructor(pages) {
        this.pages = JSON.parse(JSON.stringify(pages));
        this.initInteractives(); // init interactives html elements
    }

    initEventListener() {
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
            this.showPageList();
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
        document.getElementById('search').addEventListener('keyup', (event) => {
            document.getElementById('search').value = event.target.value;
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                this.populateBySearch(event.target.value, document.getElementById('filter').value);
            }, this.doneTypingInterval);
        });
    }



    filters = document.getElementById('filter').addEventListener('change', (event) => {
        let filter = event.target.value;
        this.populateBySearch(document.getElementById('search').value, filter)
    
    });

    populatePageList() {

        let homeContainer = document.getElementById("home-pages-container");
        let pageContainer = document.getElementById("pages-container");
        this.pages.forEach(page => {
            let pageCard = document.createElement('div');
            pageCard.classList.add('page-card');
            let pageImage = document.createElement("img");
            pageImage.draggable = false;
            pageImage.classList.add('card-img-top');
            pageImage.src = "https://img.icons8.com/glyph-neue/452/paper.png";
            let pageTitle = document.createElement("h6");
            pageTitle.classList.add('card-title');
            pageTitle.innerHTML = page.description;
            pageTitle.style.textAlign = "center";
            pageCard.append(pageImage, pageTitle);
            if (page.drafts) {
                let badge = document.createElement('span');
                badge.className = "badge badge-warning";
                badge.innerHTML = "Bozza";
                pageCard.append(badge);
            }
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

    populateBySearch(val, filter) {
        val = val ? val : "";
        document.getElementById("home-pages-container").style.display = "none";
        document.getElementById("pages-container").style.display = "none";
        let search = document.getElementById('searched');
        search.innerHTML = "";
        let searched;
        searched = this.pages.filter((page) => {
            if (page.description.toLowerCase().includes(val.toLowerCase()))
                if (filter == "all")
                    return page;
                else if (page.type == filter)
                    return page;
        });
        searched.forEach(page => {
            let pageCard = document.createElement('div');
            pageCard.classList.add('page-card');
            let pageImage = document.createElement("img");
            pageImage.draggable = false;
            pageImage.classList.add('card-img-top');
            pageImage.src = "https://img.icons8.com/glyph-neue/452/paper.png";
            let pageTitle = document.createElement("h6");
            pageTitle.classList.add('card-title');
            pageTitle.innerHTML = page.description;
            pageTitle.style.textAlign = "center";
            pageCard.append(pageImage, pageTitle);
            if (page.drafts) {
                let badge = document.createElement('span');
                badge.className = "badge badge-warning";
                badge.innerHTML = "Bozza";
                pageCard.append(badge);
            }
            $(pageCard).attr("data-toggle", "modal");
            $(pageCard).attr("data-target", "#options-modal");
            search.append(pageCard)
            pageCard.addEventListener('click', () => {
                this.showOptions(page);
            })
        })
    }

    showPageList() {
        localStorage.clear();
        if (!this.historyManager.isHistoryEmpty()) {
            swal({
                title: "Conferma",
                text: "Tutte le modifiche non salvate andranno perse!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                  window.location.reload();
                }
            });
        }
        else {
            document.getElementById('list').style.display = "block";
            document.getElementById('main').style.display = "none";
            window.location.reload();
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
                pageImage.draggable = false;
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
                    this.isDraft = true;
                    this.openPageStream(page, draft);
                    this.deleteDraftBtn.option("disabled", false);
                    this.publishPageBtn.option("disabled", false);
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
                pageImage.draggable = false;
                let pageTitle = document.createElement("h6");
                pageTitle.classList.add('card-title');
                pageTitle.innerHTML = content.language ? content.language : 'Default';
                pageTitle.style.textAlign = "center";
                pageCard.append(pageImage, pageTitle);
                pageCard.style.backgroundColor = "white"
                pageOptionsContainer.appendChild(pageCard);
                pageCard.addEventListener("click", () => {
                    this.isDraft = false;
                    document.getElementById("status").innerHTML = "pubblicato";
                    document.getElementById("status").style.color = "#22a93d";
                    $(pageCard).attr("data-toggle", "modal");
                    $(pageCard).attr("data-target", "#options-modal");
                    document.getElementById('list').style.display = "none";
                    document.getElementById('main').style.display = "block";
                    this.openPageStream(page, content);
                    this.saveInDraftBtn.option("disabled", true);
                    this.deleteDraftBtn.option("disabled", true);
                    this.publishPageBtn.option("disabled", true);
                })
            });
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
            if (page.id == pageId)
                this.openPageStream(page, page.contents[0]);
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
        document.getElementById('search').style.display = "none";
        this.loadPanel.show()
        setTimeout(() => {
            let page = JSON.parse(JSON.stringify(fullPage));
            page.contents = contentOrDraft;
            page.contents.visibility = page.contents.visibility || page.contents.visibility == 0 ? page.contents.visibility : page.visibility;
            page.contents.description = page.contents.description ? page.contents.description : page.description;
            page.contents.slug = page.contents.slug ? page.contents.slug : page.slug;
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
                        swal("", "Non ci sono modifiche da salvare", "info");
                    else if (that.historyManager.isHistoryEmpty() && that.metadataChanged) {
                        let saveManager = new SaveManager();
                        saveManager.saveInDraft(that.selectedPage, that.selectedPage);
                        document.getElementById("status").innerHTML = "bozza";
                        document.getElementById("status").style.color = "#e03e0d";
                        that.isDraft = true;
                    }
                    else if (!that.historyManager.isHistoryEmpty() || that.metadataChanged) {
                        let saveManager = new SaveManager();
                        saveManager.saveInDraft(that.selectedPage, that.historyManager.getInitialPage());
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
                    swal("Attenzione", "La pagina non ha bozze", "info");
                    return;
                }
                swal({
                    title: "Eliminare le bozze ?",
                    text: "La pagina verrà risincronizzata con la versione pubblicata",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        that.loadPanel.show();
                        setTimeout(() => {
                            that.loadPanel.hide();
                            let saveManager = new SaveManager();
                            saveManager.deleteDraft(that.selectedPage.id);
                            that.selectedPage.drafts = null;
                        
                            that.isDraft = false;
                            document.getElementById("status").innerHTML = "pubblicato";
                            document.getElementById("status").style.color = "#22a93d";
                            that.renderPageById(that.selectedPage.id);
                            that.deleteDraftBtn.option("disabled", true);
                            that.publishPageBtn.option("disabled", true);
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
                    swal("Pagina già pubblicata", "", "info");
                    return;
                }
                swal({
                    title: "Pubblicare la pagina ?",
                    text: "Le modifiche effettuate alla pagina verranno pubblicate",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
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
              }
            });  
        });
        document.getElementById("go-back").style.display = "block";
        document.getElementById("info").style.display = "flex";
        document.getElementById("save-draft-button").style.display = "block";
        document.getElementById("delete-draft-button").style.display = "block";
        document.getElementById("publish-button").style.display = "block";
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
                e.dataTransfer.setData("text/plain", JSON.stringify(widgetData));
            });
            container.ondragover = function(e) {
                e.preventDefault()
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
                if (typeof widgetData == 'number')
                    that.addWidget(parseInt(widgetData), widget.row, widget.column);
                else
                    that.replaceWidget(widget, widgetData);
                
                this.saveInDraftBtn.option('disabled', false);
            };
        }
        else if (base_id && !container) {
            let id = this.generateId(base_id);
            let dropzone = document.createElement('div');
            dropzone.classList.add("dropzone");
            dropzone.id= this.generateId('dz-');
            let addIcon = document.createElement("i");
            addIcon.className = "fa-solid fa-circle-plus";
            addIcon.style.fontSize = "60px";
            dropzone.append(addIcon);
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
                if (typeof widgetData == 'number')
                    that.addWidget(parseInt(widgetData), widget.row, widget.column);
                else
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
                    swal("Attenzione", "In quest'area è possibile aggiungere solo widget vuoti", "warning");
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
        elem.classList.add("widget");
        editButtonContainer.classList.add('edit-button-container');
        editButtonContainer.appendChild(editButton);
        editButton.className = 'fas fa-wrench edit-icon fa-lg';

        let resizer = document.createElement("div");
        resizer.className = 'resizer';
        this.initResizeEvent(resizer, widget, elem);

        container.setAttribute('draggable', false);
        container.append(editButtonContainer, elem, resizer);
        container.addEventListener('mouseover', () => {
            resizer.style.display = "block";
            elem.classList.add("structure");
        });
        container.addEventListener('mouseout', () => {
            resizer.style.display = "none";
            elem.classList.remove("structure");
        });
        elem.addEventListener('click', () => {
            this.openModifyPanel(widget);
        })
        return container;
    }

    initResizeEvent(resizer, widget, elem) {
        let pageWidth = document.getElementById("page").clientWidth;
        resizer.addEventListener('mousedown', (e) => {
            let besideWidget = this.selectedPage.contents.widgets.find(w => {return w.row == widget.row && w.column == widget.column + widget.columnSpan});
            console.log("beside widgets ", besideWidget);
            let startX = e.clientX;
            let startWidth = parseInt(document.defaultView.getComputedStyle(elem).width, 10);
            document.documentElement.addEventListener('mousemove', (e) => {
                elem.style.width = (startWidth + e.clientX - startX) + 'px';
            }, false);
            document.documentElement.addEventListener('mouseup', (e) => {
                if ((startWidth + e.clientX - startX) > startWidth && besideWidget) {
                    let oldElement = elem;
                    let newElement = oldElement.cloneNode(true);
                    newElement.style.width = startWidth + 'px';
                    oldElement.parentNode.replaceChild(newElement, oldElement);
                    swal("Attenzione", "Non è possiblie sovrapporre due elementi", "warning");
                    this.initResizeEvent(resizer, widget, newElement);
                } else if ((startWidth + e.clientX - startX) < pageWidth) {
                    let oldElement = elem;
                    let newElement = oldElement.cloneNode(true);
                    oldElement.parentNode.replaceChild(newElement, oldElement);
                    let resizeRatio = newElement.clientWidth / startWidth;
                    console.log(resizeRatio);
                    if (widget.columnSpan > 1) {
                        let oldSpan = widget.columnSpan;
                        widget.columnSpan = Math.round(widget.columnSpan * resizeRatio) != 0 ? Math.round(widget.columnSpan * resizeRatio) : 1;
                        // this.addWidget(1000, widget.row, widget.column + widget.columnSpan, oldSpan - widget.columnSpan);
                        this.renderChanges(this.selectedPage);
                        console.log(this.selectedPage.contents.widgets);
                    }
                    this.initResizeEvent(resizer, widget, newElement);
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
                    var videoContainer = this.handleVideoWidget(widget);
                    this.createDropzone('w-dz', videoContainer, widget);
                    return videoContainer;
                    break;
                case 3:
                    var pdfContainer = this.handlePdfWidget(widget);
                    this.createDropzone('w-dz', pdfContainer, widget);
                    return pdfContainer;
                    break;
                case 4:
                    var tourContainer = this.handleTourWidget(widget);
                    this.createDropzone('w-dz', tourContainer, widget);
                    return tourContainer;
                case 5:
                    var mapContainer = this.handleMapWidget(widget);
                    this.createDropzone('w-dz', mapContainer, widget);
                    return mapContainer;
                case 6:
                    var webPageContainer = this.handleWebPageWidget(widget);
                    this.createDropzone('w-dz', webPageContainer, widget);
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
            if (widget.text.value) {
                let text = document.createElement("div");
                text.innerHTML = widget.text?.value?.trim();
                this.handleTextPosition(widget, text);
                galleryContainer.appendChild(text);

            }
        }, 300)
        return galleryContainer;
    }

    handleVideoWidget(widget) {
        var videoContainer = document.createElement('div');
        var video = this.buildIframe(widget);
        const regExp = "/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/";
        var src = "https://www.youtube.com/embed/X91__O-5zz8";
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

    handleMapWidget(widget) {
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

    handleGridGalleryWidget(widget) {
        var gridGalleryContainer = document.createElement('div');
        gridGalleryContainer.classList.add('grid-gallery');
        if (widget.content.source) {
            widget.content.source.forEach(source => {
                var imageContainer = document.createElement('div'),
                    img = document.createElement('img');
                imageContainer.classList.add('image-item');
                img.src = 'assets/images/image.jpg';
                imageContainer.appendChild(img);
                gridGalleryContainer.appendChild(imageContainer);
            })
        }
        return gridGalleryContainer;
    }

    handleWebPageWidget(widget) {
        var webPageContainer = document.createElement('div');
        var webPageIframe = this.buildIframe(widget);
        webPageIframe.src = widget.content.source[0];
        webPageContainer.appendChild(webPageIframe);
        return webPageContainer;
    }

    handleHorizontalScrollGallery(widget) {
        var base_id = "horizontal-gallery";
        var [gallery, galleryWrapper] = [document.createElement('div'), document.createElement('div')];
        gallery.classList.add('gallery');
        galleryWrapper.classList.add('gallery-container');
        galleryWrapper.id = this.generateId(base_id);;
        widget.content.source.forEach(source => {
            var [itemWrapper, item] = [document.createElement('div'), document.createElement('img')];
            itemWrapper.classList.add('item-gallery-image');
            item.src = 'assets/images/image.jpg';
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
            text.style.left = widget.text.position.left;
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
        if (this.historyManager.isHistoryEmpty())
            swal("Attenzione", "Non presenti delle modifiche in questa sessione", "info")
        else {
            this.selectedPage = this.historyManager.getPreviousPage();
            this.fillPage(this.selectedPage.contents.widgets);
        }
    }

    openModifyPanel(widget) {
        document.getElementById("sidebar-default-view").style.display = "none";
        document.getElementById("sidebar-edit-view").style.display = "block";
        let text_content_id = this.generateId("0-ta-");
        let text_id = this.generateId("value-")
        let temp_selected_page = JSON.parse(JSON.stringify(this.selectedPage));
        let modifyManager = new ModifyManager(widget, JSON.parse(JSON.stringify(this.selectedPage)), text_content_id, text_id, this);
        modifyManager.initPanel();
    }

    closeModifyPanel() {
        document.getElementById("sidebar-edit-view").style.display = "none";  
        document.getElementById("sidebar-default-view").style.display = "block";  
    }

    renderChanges(modifiedPage) {
        modifiedPage = JSON.parse(JSON.stringify(modifiedPage)); // to delete reference
        if (modifiedPage) {
            if (this.historyManager.isHistoryEmpty())
                this.historyManager.updateHistory(this.selectedPage);
            this.historyManager.updateHistory(modifiedPage);
            this.selectedPage = this.historyManager.getLastPage();
            this.fillPage(this.selectedPage.contents.widgets);
        }
    }
    
    showPresets() {
        let presets = document.getElementById('presets-container');
        let dropzone = document.getElementById('dropzone');
        document.getElementById("dropzone-content").style.display = "none";
        presets.style.display = "block";
        dropzone.appendChild(presets);
    }

    applyPreset(colNumber) {
        let cols = 0;
        let rows = 0;
        if (this.selectedPage.contents.widgets.length != 0) {
            cols = this.calculateColumns(this.selectedPage.contents.widgets);
            rows = this.calculateRows(this.selectedPage.contents.widgets);
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
            this.renderChanges(this.selectedPage);
        }
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

        this.renderChanges(this.selectedPage);
    }

    replaceWidget(toWidget, fromWidget) {
        swal({
            title: "Conferma",
            text: "Sosituire il widget ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((confirm) => {
            if (confirm) {
              fromWidget = JSON.parse(fromWidget);
              let toWidgetIndex = this.selectedPage.contents.widgets.findIndex(w => w.row == toWidget.row && w.column == toWidget.column);
              this.selectedPage.contents.widgets[toWidgetIndex] = fromWidget;
              this.selectedPage.contents.widgets[toWidgetIndex].row = toWidget.row;
              this.selectedPage.contents.widgets[toWidgetIndex].column = toWidget.column;
              this.selectedPage.contents.widgets[toWidgetIndex].columnSpan = toWidget.columnSpan;
              this.renderChanges(this.selectedPage);
            }
        });
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
        this.renderChanges(this.selectedPage);
    }

}