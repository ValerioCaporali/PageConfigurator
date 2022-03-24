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

    saveInDraft(pageToSave, initialPage)
    {

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
                        DevExpress.ui.notify(response.status, "warning");
                    });
                })
                .then(({message}) => {
                    $(() => {
                        DevExpress.ui.notify(message, "warning");
                    });
                })
            }
            else
            {
                $(() => {
                    DevExpress.ui.notify("Pagina pubblicata correttamente", "success");
                })
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
                $(() => {
                    DevExpress.ui.notify("Bozza eliminata correttamente", "success");
                })
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
                $(() => {
                    DevExpress.ui.notify("Pagina salvata correttamente", "success");
                })
            }
        })
    }
    
}