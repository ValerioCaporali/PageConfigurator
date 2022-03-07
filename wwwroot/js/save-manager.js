// use this class to save both for local changes and for the api save calls
import RenderManager from "./render-manager.js";

export default class SaveManager {

    widget;
    initialWidget;
    selectedPage;
    pageHistory = [];

    constructor(widget, initialWidget, selectedPage) {

        this.widget = widget;
        this.initialWidget = initialWidget;
        this.selectedPage = selectedPage;

    }

    saveWidget() {

        this.pageHistory.push(JSON.parse(JSON.stringify(this.selectedPage)));

        let modifiedWidgets = this.selectedPage.widgets.map((currentWidget) => {
            if (currentWidget.row == this.initialWidget.row && currentWidget.column == this.initialWidget.column)
                return this.widget;
            else return currentWidget;
        })

        if (this.selectedPage.widgets != modifiedWidgets)
            this.selectedPage.widgets = modifiedWidgets;
        else alert ("Non sono state fatte delle modifiche");

        return this.selectedPage;

    }

    
}