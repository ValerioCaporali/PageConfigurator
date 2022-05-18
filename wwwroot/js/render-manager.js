import ModifyManager from './modify-manager.js'
import HistoryManager from './history-manager.js';
import SaveManager from './requests.js';
import FormData from './formData.js';
import Widget from "./widget.js";
import DefaultContents from "./defaultContents.js";
export default class RenderManager {

    pages;
    selectedPage;
    historyManager = new HistoryManager();
    typingTimer;
    doneTypingInterval = 800;
    saveInDraftBtn;
    responsiveBox;
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

    constructor(pages) {
        // var container = document.getElementById("jsoneditor");
        // var editor = new JSONEditor(container);
        // editor.set(this.selectedPage.contents.widgets);
        // var json = editor.get(); // to get modified json
        this.pages = JSON.parse(JSON.stringify(pages));
        this.initInteractives(); // init interactives html elements
    }

    initInteractives() {
        let that = this;
        document.getElementById('search').addEventListener('keyup', (event) => {
            document.getElementById('search').value = event.target.value;
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                this.populateBySearch(event.target.value, document.getElementById('filter').value);
            }, this.doneTypingInterval);
        });
        document.getElementById('create').addEventListener('click', function() {
            let type = document.getElementById('type').value;
            let slug = document.getElementById('slug').value;
            if (type && slug) {
                let slugTaken = false;
                that.pages.forEach(page => {
                    if ('/' + slug == page.slug) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Errore',
                            text: 'La path è già in uso',
                        });
                        slugTaken = true;
                    }
                })
                if (!slugTaken) {
                    new SaveManager().createPage(type, slug.toString()).then(newPage => {
                        that.selectedPage = newPage;
                        document.getElementById('grid-list').style.display = "none";
                        document.getElementById('main').style.display = "block";
                        //that.openPageStream(newPage, newPage.contents[0]);
                    })
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'I campi non sono validi',
                })
            }
        })
    }



    filters = document.getElementById('filter').addEventListener('change', (event) => {
        let filter = event.target.value;
        this.populateBySearch(document.getElementById('search').value, filter)
    
    });

    populatePageList() {
        let contents = new Array();
        let pages = JSON.parse(JSON.stringify(this.pages));
        this.pages.forEach(page => {
            if (page.drafts) {
                page.drafts.forEach(draft => {
                    draft.id = page.id;
                    contents.push(draft);
                });
            } else {
                page.contents.forEach(content => {
                    content.id = page.id;
                    contents.push(content);
                });
            }
        });
        contents.forEach(content => {
            if (!content.language)
                content.language = "Default"
            else content.language.toUpperCase();
            content.visibility = content.visibility == 1 ? "Private" : "Public";
        });
        pages.forEach(page => {
            page.drafts = page.drafts ? "true" : "false";
            page.type = page.type == 1 ? "Page" : "Home";
        })
        $(() => {
            
            let icon = [
                {
                icon: "smalliconslayout",
                style: "bold",
                hint: "Griglia",
                }]

            $('#change-view').dxButtonGroup({
                items: icon,
                keyExpr: 'style',
                stylingMode: 'text',
                selectionMode: 'multiple',
                onSelectionChanged(e) {
                    if (e.addedItems.length > 0) {
                        floatingButton.option("visible", false);
                        document.getElementById('grid-container').style.display = "none";
                        document.getElementById('grid-list').style.display = "block";
                    } else {
                        floatingButton.option("visible", true);
                        document.getElementById('grid-list').style.display = "none";
                        document.getElementById('grid-container').style.display = "block";
                    }
                },
            }).dxButtonGroup('instance');

            let floatingButton = $('#action-add').dxSpeedDialAction({
                label: 'Create page',
                icon: 'add',
                index: 1,
                onClick() {
                    dataGrid.addRow();
                    dataGrid.deselectAll();
                },
            }).dxSpeedDialAction('instance');
            
            
            let that = this;
            let dataGrid = $('#grid-container').dxDataGrid({
                dataSource: pages,
                keyExpr: 'id',
                showBorders: true,
                editing: {
                    mode: 'popup',
                    allowDeleting: true,
                    popup: {
                        title: "Crea pagina",
                        showTitle: true,
                        width: 800,
                        height: 600
                    },
                    form: {
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            colSpan: 2,
                            items: ['description', 'slug', 'type']

                        }]
                    }
                },
                onSaving: function(e) {
                    if (e.changes[0]?.data?.type)
                        new SaveManager().createPage(e.changes[0].data.type, e.changes[0].data.slug, e.changes[0].data.description)
                },
                onRowRemoved: function(e) {
                    console.log(e)
                    new SaveManager().deletePage(e.data.id);
                },
                paging: {
                    pageSize: 30,
                },
                searchPanel: {
                    visible: true,
                },
                columns: [{
                    dataField: 'description',
                    caption: 'Description',
                    width: 600,
                },
                    'slug',
                    'drafts',
                    'type',
                ],
                masterDetail: {
                    enabled: true,
                    template(container, options) {
                        const currentEmployeeData = options.data;
                        $('<div style="margin-bottom: 10px;">')
                            .addClass('master-detail-caption')
                            .text(`Languages`)
                            .appendTo(container);

                        $('<div>')
                            .dxDataGrid({
                                columnAutoWidth: true,
                                showBorders: true,
                                editing: {
                                    mode: 'popup',
                                    allowAdding: true,
                                    allowDeleting: true,
                                    popup: {
                                        title: "Aggiungi lingua",
                                        showTitle: true,
                                        width: 700,
                                        height: 525
                                    },
                                    form: {
                                        items: [{
                                            itemType: 'group',
                                            colCount: 2,
                                            colSpan: 2,
                                            items: ['language']
                                            
                                        }]
                                    }
                                },
                                onSaving: function (e) {
                                    if (e.changes[0]?.data?.language)
                                        new SaveManager().newLanguage(e.changes[0].insertBeforeKey, false, e.changes[0].data.language, that);
                                },
                                onRowRemoved: function(e) {
                                    console.log(e)
                                    let language = e.data.language != "Default" ? e.data.language : null
                                    new SaveManager().deleteLanguage(e.data.id, language);
                                    dataGrid.refresh();
                                },
                                columns: ['language', 'title', 'visibility',
                                    {
                                        cellTemplate: function (container, options) {
                                            $('<a style="text-decoration: underline;"/>').addClass('dx-link')
                                                .text('Edit')
                                                .on('dxclick', function () {
                                                    let language = options.data.language != "Default" ? options.data.language : null;
                                                    window.location.href = "https://localhost:5001/api/pages/" + options.data.id + "/" + language;
                                                })
                                                .appendTo(container);
                                        }
                                    }],
                                dataSource: new DevExpress.data.DataSource({
                                    store: new DevExpress.data.ArrayStore({
                                        key: 'id',
                                        data: contents,
                                    }),
                                    filter: ['id', '=', options.key],
                                }),
                            }).appendTo(container);
                    },
                },
            }).dxDataGrid('instance');
        });

        // let homeListContainer = document.getElementById("home-pages-list-container"),
        //     pageListContainer = document.getElementById("pages-list-container"),
        //     homeList = document.createElement("ul"),
        //     pageList = document.createElement("ul");
        // this.pages.forEach(page => {
        //     let pageField = document.createElement("li");
        //     pageField.className = "page-field";
        //     let container = document.createElement('div');
        //     container.style.display = "flex";
        //     let dropdownArrow = document.createElement("img");
        //     dropdownArrow.src = "https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/344/external-Down-arrows-tanah-basah-glyph-tanah-basah-5.png";
        //     dropdownArrow.style.width = "21px";
        //     dropdownArrow.style.margin = "auto";
        //     dropdownArrow.style.marginRight = "0";
        //     let collapseArrow = document.createElement("img");
        //     collapseArrow.src = "https://img.icons8.com/ios-filled/344/collapse-arrow.png";
        //     collapseArrow.style.width = "21px";
        //     collapseArrow.style.margin = "auto";
        //     collapseArrow.style.display = "none";
        //     collapseArrow.style.marginRight = "0";
        //     let description = document.createElement('p');
        //     description.style.margin = "3px";
        //     description.innerText = page.description;
        //     let languagesContainer = document.createElement("div");
        //     languagesContainer.style.display = "none";
        //     page.contents.forEach(content => {
        //         let language = document.createElement("div");
        //         language.className = "language-option"
        //         language.innerText = content.language ? content.language.toUpperCase() : "Default";
        //         language.onclick = () => {window.location.href = "https://localhost:5001/api/pages/" + page.id + "/" + content.language;}
        //         languagesContainer.appendChild(language);
        //     });
        //     container.append(description, dropdownArrow, collapseArrow);
        //     pageField.append(container, languagesContainer);
        //     dropdownArrow.addEventListener('click', () => {
        //         dropdownArrow.style.display = "none";
        //         collapseArrow.style.display = "block";
        //         languagesContainer.style.display = "flex";
        //     });
        //     collapseArrow.addEventListener('click', () => {
        //         collapseArrow.style.display = "none";
        //         dropdownArrow.style.display = "block";
        //         languagesContainer.style.display = "none";
        //     })
        //     if (page.type == 0)
        //         homeList.appendChild(pageField);
        //     else 
        //         pageList.appendChild(pageField);
        // });
        // homeListContainer.appendChild(homeList);
        // pageListContainer.appendChild(pageList);
        
        
        
        let homeContainer = document.getElementById("home-pages-grid-container");
        let pageContainer = document.getElementById("pages-grid-container");
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
        });
        
        document.getElementById('grid-page-view').addEventListener('click', () => {
            document.getElementById('grid-container').style.display = "none";
            document.getElementsByClassName('dx-overlay')[0].style.display = "none";
            document.getElementById('grid-list').style.display = "block";
        });
        
        document.getElementById('list-page-view').addEventListener('click', () => {
            document.getElementById('grid-list').style.display = "none";
            document.getElementsByClassName('dx-overlay')[0].style.display = "block";
            document.getElementById('grid-container').style.display = "block";
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
            if (page.description?.toLowerCase().includes(val.toLowerCase()))
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
                //  Link alla pagina dedicata per il configuratore della pagina specifica
                let linkToPage = document.createElement('a');
                linkToPage.href = "https://localhost:5001/api/pages/" + page.id + "/" + draft.language;
                linkToPage.append(pageCard);
                pageOptionsContainer.appendChild(linkToPage);
                // pageCard.addEventListener("click", () => {
                //        
                //     
                //     
                //     // document.getElementById("status").innerHTML = "bozza";
                //     // document.getElementById("status").style.color = "#e03e0d";
                //     // $(pageCard).attr("data-toggle", "modal");
                //     // $(pageCard).attr("data-target", "#options-modal");
                //     // document.getElementById('list').style.display = "none";
                //     // document.getElementById('main').style.display = "block";
                //     // this.isDraft = true;
                //     // this.openPageStream(page, draft);
                //     // this.deleteDraftBtn.option("disabled", false);
                //     // this.publishPageBtn.option("disabled", false);
                // })
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
                let linkToPage = document.createElement('a');
                linkToPage.href = "https://localhost:5001/api/pages/" + page.id + "/" + content.language;
                linkToPage.append(pageCard);
                pageOptionsContainer.appendChild(linkToPage);
                pageCard.addEventListener("click", () => {
                    //  Link alla pagina dedicata per il configuratore della pagina specifica
                    // this.isDraft = false;
                    // document.getElementById("status").innerHTML = "pubblicato";
                    // document.getElementById("status").style.color = "#22a93d";
                    // $(pageCard).attr("data-toggle", "modal");
                    // $(pageCard).attr("data-target", "#options-modal");
                    // document.getElementById('list').style.display = "none";
                    // document.getElementById('main').style.display = "block";
                    // this.openPageStream(page, content);
                    // this.saveInDraftBtn.option("disabled", true);
                    // this.deleteDraftBtn.option("disabled", true);
                    // this.publishPageBtn.option("disabled", true);
                })
            });
        }
        
        let languageContainer = document.createElement('div'),
            languageSelect = document.createElement("select");
        languageSelect.style.height = "33px";
        languageSelect.style.margin = "auto";
        languageSelect.style.marginBottom = "0";
        languageSelect.style.marginRight = "10px";
        languageContainer.className = "language-select";
        languageSelect.className = "form-select form-inline form-select-sm";
        languageSelect.style.width = "35%";
        let existingLanguages = new Array();
        page.contents.forEach(content => existingLanguages.push(content.language));
        let allowedLanguages = this.languages.filter(lan => existingLanguages.indexOf(lan) == -1);
        allowedLanguages.forEach(lan => {
            let option = document.createElement('option');
            option.value = lan.toString();
            option.innerText = lan.toString().charAt(0).toUpperCase() + lan.slice(1);
            languageSelect.append(option);
        })
        let newLanguageButton = document.createElement('button');
        newLanguageButton.className = "btn btn-primary btn-sm newLanguageBtn";
        newLanguageButton.style.width = "75%";
        newLanguageButton.innerText = "Crea nuova lingua";
        languageContainer.append(languageSelect, newLanguageButton);
        pageOptionsContainer.appendChild(languageContainer);
        $(newLanguageButton).attr("data-toggle", "modal");
        $(newLanguageButton).attr("data-target", "#options-modal");
        newLanguageButton.addEventListener('click', () => {
            let saveManager = new SaveManager().newLanguage(page.id, false, languageSelect.value, this);
            window.location = 'https://localhost:5001/api/pages/' + page.id + "/" + languageSelect.value;
            // document.getElementById('list').style.display = "none";
            // document.getElementById('main').style.display = "block";
        })
    }

}