export default class Widget {
    
    formData;

    constructor(formData) {
        this.formData = formData;
        this.widgetBinding();
    }

    widget = {

        id: null,

        row: null,

        mobileRow: null,

        rowSpan: null,

        column: null,

        columnSpan: null,

        type: null,

        content: null,

        clickAction: this.clickAction,

        text: null,

        style: this.style,

        mobileStyle: this.style,

        hover: null

    }

    clickAction = {

    }

    style = {

        width: null,

        height: null,

        margin: this.spaceProperty,

        background: null,

        textColor: null,

        fontFamily: null,

        fontSize: null,

        padding: this.spaceProperty,

        borders: this.borderProperty

    }

    spaceProperty = {

        total: null,

        top: null,

        bottom: null,

        left: null,

        right: null
        
    }

    borderProperty = {

        type: null,

        style: null,

        width: null,
        
        color: null
        
    }

    widgetBinding() {
        this.widget.id = this.formData.propertyTab.Id ? this.formData.propertyTab.Id : null
        this.widget.type = this.formData.propertyTab.Tipo ? this.formData.propertyTab.Tipo : null
        this.widget.type = this.formData.propertyTab.Tipo ? this.formData.propertyTab.Tipo : null
    }
}