export default class SaveManager {

    widget;
    initialWidget;
    updatedPage;

    constructor(widget, initialWidget, selectedPage) {

        this.widget = widget;
        this.initialWidget = initialWidget;
        this.updatedPage = selectedPage;

    }

    updatePage() {

        var modifiedWidgets = this.updatedPage.widgets.map((currentWidget) => {
            if (currentWidget.row == this.initialWidget.row && currentWidget.column == this.initialWidget.column)
                return this.widget;
            else return currentWidget;
        })

        if (this.updatedPage.widgets != modifiedWidgets)
            this.updatedPage.widgets = modifiedWidgets;
        else alert ("Non sono state fatte delle modifiche");

        return this.updatedPage;

    }

    
}