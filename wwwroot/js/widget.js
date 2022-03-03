export default class Widget {
    
    formData;

    constructor(formData) {
        this.formData = formData;
        console.log(formData);
        this.widgetBinding();
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

        borders: this.borderProperty

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

        borders: this.mobileBorderProperty

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
        this.widget.id = this.formData.propertyTab.Id;
        this.widget.type = this.formData.propertyTab.Tipo;
        this.widget.row = this.formData.propertyTab.Riga;
        this.widget.column = this.formData.propertyTab.Colonna;
        this.widget.rowSpan = this.formData.propertyTab.EspansioneRiga;
        this.widget.columnSpan = this.formData.propertyTab.EspansioneColonna;
        this.widget.mobileRow = this.formData.propertyTab.RigaMobile;

        this.style.height = this.formData.styleTab?.Altezza ? this.formData.styleTab.Altezza : null
        this.style.width = this.formData.styleTab.Larghezza ? this.formData.styleTab.Larghezza : null
        this.margin.total = this.formData.styleTab.MargineTotale ? this.formData.styleTab.MargineTotale : null
        this.margin.top = this.formData.styleTab.MargineSopra ? this.formData.styleTab.MargineSopra : null
        this.margin.right = this.formData.styleTab.MargineDestra ? this.formData.styleTab.MargineDestra : null
        this.margin.bottom = this.formData.styleTab.MargineSotto ? this.formData.styleTab.MargineSotto : null
        this.margin.left = this.formData.styleTab.MargineSinistra ? this.formData.styleTab.MargineSinistra : null
        this.style.background = this.formData.styleTab.Background ? this.formData.styleTab.Background : null
        this.style.textColor = this.formData.styleTab.TextColor ? this.formData.styleTab.TextColor : null
        this.style.fontFamily = this.formData.styleTab.FontFamily ? this.formData.styleTab.FontFamily : null
        this.style.fontSize = this.formData.styleTab.FontSize ? this.formData.styleTab.FontSize : null
        this.padding.total = this.formData.styleTab.PaddingTotale ? this.formData.styleTab.PaddingTotale : null
        this.padding.top = this.formData.styleTab.PaddingSopra ? this.formData.styleTab.PaddingSopra : null
        this.padding.right = this.formData.styleTab.PaddingDestra ? this.formData.styleTab.PaddingDestra : null
        this.padding.bottom = this.formData.styleTab.PaddingSotto ? this.formData.styleTab.PaddingSotto : null
        this.padding.left = this.formData.styleTab.PaddingSinistra ? this.formData.styleTab.PaddingSinistra : null

        this.mobileStyle.height = this.formData.mobileStyleTab.Altezza ? this.formData.mobileStyleTab.Altezza : null
        this.mobileStyle.width = this.formData.mobileStyleTab.Larghezza ? this.formData.mobileStyleTab.Larghezza : null
        this.mobileMargin.total = this.formData.mobileStyleTab.MargineTotale ? this.formData.mobileStyleTab.MargineTotale : null
        this.mobileMargin.top = this.formData.mobileStyleTab.MargineSopra ? this.formData.mobileStyleTab.MargineSopra : null
        this.mobileMargin.right = this.formData.mobileStyleTab.MargineDestra ? this.formData.mobileStyleTab.MargineDestra : null
        this.mobileMargin.bottom = this.formData.mobileStyleTab.MargineSotto ? this.formData.mobileStyleTab.MargineSotto : null
        this.mobileMargin.left = this.formData.mobileStyleTab.MargineSinistra ? this.formData.mobileStyleTab.MargineSinistra : null
        this.mobileStyle.background = this.formData.mobileStyleTab.Background ? this.formData.mobileStyleTab.Background : null
        this.mobileStyle.textColor = this.formData.mobileStyleTab.TextColor ? this.formData.mobileStyleTab.TextColor : null
        this.mobileStyle.fontFamily = this.formData.mobileStyleTab.FontFamily ? this.formData.mobileStyleTab.FontFamily : null
        this.mobileStyle.fontSize = this.formData.mobileStyleTab.FontSize ? this.formData.mobileStyleTab.FontSize : null
        this.mobilePadding.total = this.formData.mobileStyleTab.PaddingTotale ? this.formData.mobileStyleTab.PaddingTotale : null
        this.mobilePadding.top = this.formData.mobileStyleTab.PaddingSopra ? this.formData.mobileStyleTab.PaddingSopra : null
        this.mobilePadding.right = this.formData.mobileStyleTab.PaddingDestra ? this.formData.mobileStyleTab.PaddingDestra : null
        this.mobilePadding.bottom = this.formData.mobileStyleTab.PaddingSotto ? this.formData.mobileStyleTab.PaddingSotto : null
        this.mobilePadding.left = this.formData.mobileStyleTab.PaddingSinistra ? this.formData.mobileStyleTab.PaddingSinistra : null
        
        this.widget.hover = this.formData.eventsTab.Hover ? this.formData.eventsTab.Hover : null

        this.text.value = tinymce.get("value").getContent({format : 'raw'}).toString();
        this.position.type = this.formData.textTab.TipoPosizione ? this.formData.textTab.TipoPosizione : null;
        this.position.top = this.formData.textTab.Sopra ? this.formData.textTab.Sopra : null;
        this.position.right = this.formData.textTab.Destra ? this.formData.textTab.Destra : null;
        this.position.bottom = this.formData.textTab.Sotto ? this.formData.textTab.Sotto : null;
        this.position.left = this.formData.textTab.Sinistra ? this.formData.textTab.Sinistra : null;

        switch (this.formData.propertyTab.Tipo) {
            case 0:
                this.formData.htmlConfiguration.text = tinymce.get("0-text").getContent({format : 'raw'}).toString();
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
                this.widget.content = this.formData.pdfConfiguration
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
                let webpageSource = this.formData.webpageConfiguration.source.toString().split(/\r?\n/);
                this.formData.webpageConfiguration.source = webpageSource;
                this.widget.content = this.webpageConfiguration;
                break;
            case 101:
                let horizontalScrollGallerySource = this.formData.horizontalScrollGalleryConfiguration.source.toString().split(/\r?\n/);
                this.formData.horizontalScrollGalleryConfiguration.source = horizontalScrollGallerySource;
                this.widget.content = this.formData.horizontalScrollGalleryConfiguration;
                break;
            default:
                break;
        }

        console.log(this.widget);

    }
}