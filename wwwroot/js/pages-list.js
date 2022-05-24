import HistoryManager from './history-manager.js';
import SaveManager from './requests.js';
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
    chosenLanguage = {
        language: ''
    }
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
                onSaving: async function(e) {
                    if (e.changes[0]?.data?.type) {
                        let newPage = await new SaveManager().createPage(e.changes[0].data.type, e.changes[0].data.slug, e.changes[0].data.description)
                        window.location.href = "https://localhost:5001/pages/" + newPage.id + "/null";
                    }
                },
                onRowRemoved: function(e) {
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
                                        height: 525,
                                    },
                                    form: {
                                        formData: that.chosenLanguage,
                                        items: [{
                                            // itemType: 'group',
                                            editorType: 'dxSelectBox',
                                            dataField: 'language',
                                            editorOptions: {
                                                items: that.languages,
                                            },
                                            colCount: 1,
                                            colSpan: 1,
                                            
                                        }]
                                    }
                                },
                                onSaving: function (e) {
                                    console.log(that.chosenLanguage, e)
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
                                                    window.location.href = "https://localhost:5001/pages/" + options.data.id + "/" + language;
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
                let language = draft.language ? draft.language : null;
                linkToPage.href = "https://localhost:5001/pages/" + page.id + "/" + language;
                linkToPage.append(pageCard);
                pageOptionsContainer.appendChild(linkToPage);
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
                let language = content.language != "Default" ? content.language : null;
                linkToPage.href = "https://localhost:5001/pages/" + page.id + "/" + language;
                linkToPage.append(pageCard);
                pageOptionsContainer.appendChild(linkToPage);
                pageCard.addEventListener("click", () => {
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
            window.location = 'https://localhost:5001/pages/' + page.id + "/" + languageSelect.value;
        })
    }

}