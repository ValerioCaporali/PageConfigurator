import RenderManager from "./render-manager.js";
import PageRender from "./page-render.js";

export default class SaveManager {

    base_url = 'api/Pages/';
    widget;
    initialWidget;
    updatedPage;
    metadata;

    constructor(widget, initialWidget, selectedPage, metadata) {

        this.widget = widget;
        this.initialWidget = initialWidget;
        this.updatedPage = selectedPage;
        this.metadata = metadata;

    }

    updatePage()
    {

        var modifiedWidgets = this.updatedPage.contents.widgets.map((currentWidget) => {
            if (currentWidget.row == this.initialWidget.row && currentWidget.column == this.initialWidget.column)
                return this.widget;
            else return currentWidget;
        })

        if (this.updatedPage.contents.widgets != modifiedWidgets)
            this.updatedPage.contents.widgets = modifiedWidgets;
        else alert ("Non sono state fatte delle modifiche");

        this.updatedPage.contents.language = this.metadata.language;
        this.updatedPage.contents.title = this.metadata.title;
        this.updatedPage.visibility = this.metadata.visibility;
        this.updatedPage.slug = this.metadata.slug;
        this.updatedPage.description = this.metadata.description;

        return this.updatedPage;

    }

    updateMetadata() {
        
    }

    isPageValid(page) {
        console.log(page);
        page.contents.widgets.forEach(widget => {
            if (widget.row == null || widget.column == null) {
                swal("Errore", "I campi riga e colonna non possono essere vuoti", "warning");
                return false
            }
            
            switch (widget.type) {
                case 0:
                    if (!widget.content.text) {
                        return false;
                    }
                    return true;
                    break;
    
                case 1:
                case 2:
                case 3:
                case 101:
                case 102:
                    if (widget.content.source == null || widget.content.source == "") {
                        return false;
                    }
                    return true;
                    break;
    
                case 4:
                    if (widget.content.source == null || widget.content.showCaseId == null) {
                        return false;
                    }
                    return true;
                    break;
    
                case 5:
                    if (widget.content.latitude == null || widget.content.longitude == null) {
                        return false;
                    }
                    return true;
                    break;
                case 6:
                    if (!widget.content.source) {
                        return false;
                    }
                    return true;
                    break;
                case 1000:
                    return true;
                default:
                    return true;
                    break;
            }
        });
    }

    saveInDraft(history) {

         // if(!this.isPageValid(pageToSave)) {
         //     Swal.fire({
         //         icon: 'error',
         //         title: 'Errore',
         //         text: 'La pagina non può essere salvata. Controllare tutti i campi richiesti',
         //     });
         //     return;
         // }

        var draft = [];
        var oldDraft = [];

        let pageToSave = JSON.parse(JSON.stringify(history[history.length - 1]));
        let initialPage = JSON.parse(JSON.stringify(history[0]));

        console.log(pageToSave);

        draft.push(pageToSave.contents);
        pageToSave.contents = draft;

        oldDraft.push(initialPage.contents);
        initialPage.contents = oldDraft;

        const data = {
            page: pageToSave,
            initialPage: initialPage
        }

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        }

        fetch('https://localhost:5001/api/pages/save', options)
        .then(response => {
            if(!response.ok)
            {
                response.json()
                .catch(() => {
                    $(() => {
                        swal(message, "warning");
                    });
                })
                .then(({message}) => {
                    swal(message, "warning");
                })
            }
            else
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Pagina salvata !',
                    text: 'La pagina è stata salvata correttamente nelle bozze',
                });
            }
        })

    }

    deleteDraft(guid) {
        const data = {
            id: guid
        }

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        }

        fetch('https://localhost:5001/api/pages/delete-draft', options)
        .then(response => {
            if(!response.ok)
            {
                response.json()
                .catch(() => {
                    $(() => {
                        DevExpress.ui.notify(response.status, "warning");
                    });
                })
                .then(({message}) => {
                    $(() => {
                        DevExpress.ui.notify(message);
                    });
                })
            }
            else
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Bozza eliminata',
                    text: 'La bozza è stata eliminata correttamente',
                });
            }
        })
    }

    
    publishPage(guid) {
        const data = {
            id: guid
        };

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch('https://localhost:5001/api/pages/publish', options)
        .then(response => {
            if(!response.ok)
            {
                response.json()
                .catch(() => {
                    $(() => {
                        DevExpress.ui.notify(response.status);
                    })
                })
                .then(({message}) => {
                    $(() => {
                        DevExpress.ui.notify(message);
                    });
                })
            }
            else
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Pagina pubblicata !',
                    text: 'La pagina è stata pubblicata correttamente',
                });
            }
        })
    }

    deletePage(guid) {
        
        const data = {
            id: guid
        };

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch('https://localhost:5001/api/pages/delete-page', options)
        .then(response => {
            if(!response.ok)
            {
                response.json()
                .catch(() => {
                    $(() => {
                        DevExpress.ui.notify(response.status);
                    })
                })
                .then(({message}) => {
                    $(() => {
                        DevExpress.ui.notify(message);
                    });
                })
            }
            else
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Pagina Eliminata !',
                    text: 'La pagina è stata eliminata correttamente',
                });
            }
        })
    }

    async createPage(type, slug, description) {
        const data = {
            type: Number(type),
            slug: slug,
            description: description
        };

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        let response = await fetch('https://localhost:5001/api/pages/create', options);
        let newPage = await response.json();
        return newPage;
    }
    
    newLanguage(guid, duplicate, language, renderer) {
        const data = {
            id: guid,
            duplicate: duplicate,
            language: language
        };
        
        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        fetch('https://localhost:5001/api/pages/new-language', options).then(response => {
            if(!response.ok) {
                response.json()
                    .catch(() => {
                        $(() => {
                            DevExpress.ui.notify(response.status);
                        })
                    })
                    .then(({message}) => {
                        $(() => {
                            DevExpress.ui.notify(message);
                        });
                    })
            }
            else
            {
                response.json().then(data => {
                    let newContent;
                    data.contents.forEach(content => {
                        if (content.language == language) 
                            newContent = content;
                    })
                    window.location.href = "https://localhost:5001/pages/" + guid + "/" + language;
                })
            }
        })
        
    }
    
    deleteLanguage(guid, language) {
        const data = {
            id: guid,
            language: language
        };
        
        const options = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        
        fetch('https://localhost:5001/api/pages/delete-language', options).then(response => {
            if (!response.ok) {
                response.json()
                    .catch(() => {
                        $(() => {
                            DevExpress.ui.notify(response.status);
                        })
                    })
                    .then(({message}) => {
                        $(() => {
                            DevExpress.ui.notify(message);
                        });
                    })
            }
            else {
                Swal.fire({
                    icon: 'success',
                    title: 'Lingua eliminata correttamente !'
                });
            }
        })
    }
    
    async getPagesByType(type) {
        let response = await fetch("https://localhost:5001/api/Pages/get-all/" + type);
        if (!response.ok) {
            let message = await response.json();
            $(() => {
                DevExpress.ui.notify(message);
            });
            return;
        }
        let data = await response.json();
        return data;
    }
    
    async getPageById(pageId, pageLan) {
        
        let page = {
            metadata: null,
            content: null
        }
        
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

        let response = await fetch('https://localhost:5001/api/pages/get', options);
            if(!response.ok) {
                let message = await response.json();
                console.log(message.status)
                //$(() => {
                //    DevExpress.ui.notify(message);
                //});
            }
            else
            {
                let data = await response.json();
                let specificContent;
                if (data.drafts) {
                    data.drafts.forEach(draft => {
                        if (draft.language == pageLan && pageLan)
                            specificContent = draft;
                        else if (!draft.language)
                            specificContent = draft;
                    });
                } else {
                    data.contents.forEach(content => {
                        if (content.language == pageLan && pageLan)
                            specificContent = content;
                        else if (!content.language)
                            specificContent = content;
                    });
                }
                page.metadata = data;
                page.content = specificContent;
                // let renderer = new PageRender(data, specificContent);
                // renderer.openPageStream(data, specificContent);
            }
        return page;
    }
    
}