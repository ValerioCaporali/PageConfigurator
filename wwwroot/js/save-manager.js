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

    updatePage() { // locally

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
        this.updatedPage.type = this.metadata.type;
        this.updatedPage.visibility = this.metadata.type;
        this.updatedPage.slug = this.metadata.slug;
        this.updatedPage.description = this.metadata.description;

        return this.updatedPage;

    }

    saveInDraft(pageToSave, initialPage) { // database

        var draft = [];
        var oldDraft = [];

        JSON.parse(JSON.stringify(pageToSave));
        JSON.parse(JSON.stringify(initialPage));

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

        fetch(this.base_url + 'save-draft', options)
            .then(response => response.json())
            .then (response => console.log(response))
            .catch(error => console.log(error));

    }

    
    savePage() {
        // draft to content
    }

    
}