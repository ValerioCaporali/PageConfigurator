export default class Widget {
    
    formData;
    text_content_id;
    text_id;
    borders;
    mobileBorders;

    constructor(formData, text_content_id, text_id, borders, mobileBorders) {

        this.formData = formData;
        this.text_content_id = text_content_id;
        this.text_id = text_id;
        this.borders = borders;
        this.mobileBorders = mobileBorders;
        
    }

    position = {

        type: null,

        top: null,

        bottom: null,

        right: null,

        left: null

    }

    text = {

        value: null,

        position: this.position

    }

    margin = {

        total: null,

        top: null,

        bottom: null,

        left: null,

        right: null
        
    }


    mobileMargin = {

        total: null,

        top: null,

        bottom: null,

        left: null,

        right: null
        
    }


    padding = {

        total: null,

        top: null,

        bottom: null,

        left: null,

        right: null
        
    }


    mobilePadding = {

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


    mobileBorderProperty = {

        type: null,

        style: null,

        width: null,
        
        color: null
        
    }

    clickAction = {

    }

    style = {

        width: null,

        height: null,

        margin: this.margin,

        background: null,

        textColor: null,

        fontFamily: null,

        fontSize: null,

        padding: this.padding,

        borders: []

    }

    mobileStyle = {

        width: null,

        height: null,

        margin: this.mobileMargin,

        background: null,

        textColor: null,

        fontFamily: null,

        fontSize: null,

        padding: this.mobilePadding,

        borders: []

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

        text: this.text,

        style: this.style,

        mobileStyle: this.mobileStyle,

        hover: null

    }

    widgetBinding() {

        this.widget.id = this.formData.propertyTab.id;
        this.widget.type = this.formData.propertyTab.type;
        this.widget.row = this.formData.propertyTab.row;
        this.widget.column = this.formData.propertyTab.column;
        this.widget.rowSpan = this.formData.propertyTab.rowSpan;
        this.widget.columnSpan = this.formData.propertyTab.columnSpan;
        this.widget.mobileRow = this.formData.propertyTab.mobileRow;

        this.style.height = this.formData.styleTab?.height;
        this.style.width = this.formData.styleTab.width;
        this.margin.total = this.formData.styleTab.marginTotal;
        this.margin.top = this.formData.styleTab.marginTop;
        this.margin.right = this.formData.styleTab.marginRight;
        this.margin.bottom = this.formData.styleTab.marginBottom;
        this.margin.left = this.formData.styleTab.marginLeft;
        this.style.background = this.formData.styleTab.Background;
        this.style.textColor = this.formData.styleTab.TextColor;
        this.style.fontFamily = this.formData.styleTab.FontFamily;
        this.style.fontSize = this.formData.styleTab.FontSize;
        this.padding.total = this.formData.styleTab.paddingTotal;
        this.padding.top = this.formData.styleTab.paddingTop;
        this.padding.right = this.formData.styleTab.paddingRight;
        this.padding.bottom = this.formData.styleTab.paddingBottom;
        this.padding.left = this.formData.styleTab.paddingLeft;

        // mobileBorderProperty = {

        //     type: null,
    
        //     style: null,
    
        //     width: null,
            
        //     color: null
            
        // }

        if (this.borders) {
            for (let i = 0; i < this.borders.length; i++) {
                let border = {
                    type: null,
                    style: this.formData.styleTab.borderStyle,
                    width: this.formData.styleTab.borderWidth,
                    color: this.formData.styleTab.borderColor
                };
                switch (this.borders[i]) {
                    case 'fullscreen':
                        border.type = 0
                        break;
                    case 'arrowleft':
                        border.type = 1
                        break;
                    case 'arrowright':
                        border.type = 2
                        break;
                    case 'arrowtop':
                        border.type = 3
                        break;
                    case 'arrowbottom':
                        border.type = 4
                        break;
                
                    default:
                        break;
                };

                this.style.borders.push(border);
            }
        }

        this.mobileStyle.height = this.formData.mobileStyleTab.height;
        this.mobileStyle.width = this.formData.mobileStyleTab.width;
        this.mobileMargin.total = this.formData.mobileStyleTab.marginTotal;
        this.mobileMargin.top = this.formData.mobileStyleTab.marginTop;
        this.mobileMargin.right = this.formData.mobileStyleTab.marginRight;
        this.mobileMargin.bottom = this.formData.mobileStyleTab.marginBottom;
        this.mobileMargin.left = this.formData.mobileStyleTab.marginLeft;
        this.mobileStyle.background = this.formData.mobileStyleTab.Background;
        this.mobileStyle.textColor = this.formData.mobileStyleTab.TextColor;
        this.mobileStyle.fontFamily = this.formData.mobileStyleTab.FontFamily;
        this.mobileStyle.fontSize = this.formData.mobileStyleTab.FontSize;
        this.mobilePadding.total = this.formData.mobileStyleTab.paddingTotal;
        this.mobilePadding.top = this.formData.mobileStyleTab.paddingTop;
        this.mobilePadding.right = this.formData.mobileStyleTab.paddingRight;
        this.mobilePadding.bottom = this.formData.mobileStyleTab.paddingBottom;
        this.mobilePadding.left = this.formData.mobileStyleTab.paddingLeft;

        if (this.mobileBorders) {
            for (let i = 0; i < this.mobileBorders.length; i++) {
                let mobileBorder = {
                    type: null,
                    style: this.formData.mobileStyleTab.borderStyle,
                    width: this.formData.mobileStyleTab.borderWidth,
                    color: this.formData.mobileStyleTab.borderColor
                };
                switch (this.mobileBorders[i]) {
                    case 'fullscreen':
                        mobileBorder.type = 0
                        break;
                    case 'arrowleft':
                        mobileBorder.type = 1
                        break;
                    case 'arrowright':
                        mobileBorder.type = 2
                        break;
                    case 'arrowtop':
                        mobileBorder.type = 3
                        break;
                    case 'arrowbottom':
                        mobileBorder.type = 4
                        break;
                
                    default:
                        break;
                };

                this.mobileStyle.borders.push(mobileBorder);
            }
        }
        
        this.widget.hover = this.formData.eventsTab.Hover;

        this.text.value = tinymce.get(this.text_id).getContent({format : 'raw'}).toString();
        this.position.type = this.formData.textTab.positionType;
        this.position.top = this.formData.textTab.top ? this.formData.textTab.top : null;
        this.position.right = this.formData.textTab.right ? this.formData.textTab.right : null;
        this.position.bottom = this.formData.textTab.bottom ? this.formData.textTab.bottom : null;
        this.position.left = this.formData.textTab.left ? this.formData.textTab.left : null;

        switch (this.formData.propertyTab.type) {
            case 0:
                this.formData.htmlConfiguration.text = tinymce.get(this.text_content_id).getContent({format : 'raw'}).toString();
                this.widget.content = this.formData.htmlConfiguration;
                break;
            case 1: 
                let gallerySource = this.formData.galleryConfiguration.source.toString().split(",");
                console.log(gallerySource);
                this.formData.galleryConfiguration.source = gallerySource;
                this.widget.content = this.formData.galleryConfiguration;
                break;
            case 2:
                let videoSource = this.formData.videoConfiguration.source.toString().split(/\r?\n/);
                this.formData.videoConfiguration.source = videoSource;
                this.widget.content = this.formData.videoConfiguration;
                break;
            case 3:
                this.widget.content = this.formData.pdfConfiguration;
                break;
            case 4:
                let showcaseSource = this.formData.showcaseConfiguration.source.toString().split(/\r?\n/);
                this.formData.showcaseConfiguration.source = showcaseSource;
                this.widget.content = this.formData.showcaseConfiguration;
                break;
            case 5:
                this.widget.content = this.formData.mapConfiguration;
                break;
            case 6:
                let webpageSource = this.formData.webPageConfiguration.source.toString().split(/\r?\n/);
                this.formData.webPageConfiguration.source = webpageSource;
                this.widget.content = this.formData.webPageConfiguration;
                break;
            case 101:
                let horizontalScrollGallerySource = this.formData.horizontalScrollGalleryConfiguration.source.toString().split(/\r?\n/);
                this.formData.horizontalScrollGalleryConfiguration.source = horizontalScrollGallerySource;
                this.widget.content = this.formData.horizontalScrollGalleryConfiguration;
                break;
            default:
                break;
        }

        return this.widget;
        
    }

}