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

    saveInDraft(pageToSave, initialPage)
    {

         if(!this.isPageValid(pageToSave)) {
             Swal.fire({
                 icon: 'error',
                 title: 'Errore',
                 text: 'La pagina non può essere salvata. Controllare tutti i campi richiesti',
             });
             return;
         }

        var draft = [];
        var oldDraft = [];

        pageToSave = JSON.parse(JSON.stringify(pageToSave));
        initialPage = JSON.parse(JSON.stringify(initialPage));

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

        fetch(this.base_url + 'save', options)
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

    deleteDraft(guid)
    {
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

        fetch(this.base_url + 'delete-draft', options)
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

    
    publishPage(guid)
    {
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

        fetch(this.base_url + 'publish', options)
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
    
}