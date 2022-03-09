// use this class to save both for local changes and for the api save calls
import RenderManager from "./render-manager.js";

export default class SaveManager {

    widget;
    initialWidget;
    updatedPage;
    // pageHistory = [];

    constructor(widget, initialWidget, selectedPage) {

        this.widget = widget;
        this.initialWidget = initialWidget;
        this.updatedPage = selectedPage;

    }

    updatePage() {

        // this.pageHistory.push(JSON.parse(JSON.stringify(this.selectedPage)));

        let modifiedWidgets = this.updatedPage.widgets.map((currentWidget) => {
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