export default class FormData {

    widget;

    constructor (widget) {
        this.widget = widget;
        this.bindData();
    }

    Type = [
        "Testo",
        "Galleria",
        "Video",
        "Pdf",
        "Tour",
        "Mappa",
        "Pagina web",
        "Galleria orizzontale",
        "Galleria a griglia",
    ];

    PosizioneTesto = [
        "Centrato",
        "Assoluto"
    ];

    TextPosition = [
        "Centrato",
        "Assoluto"
    ];

    Hover = [
        "none",
        "default",
        "underline",
        "expand"
    ];

    propertyTab = {
        Tipo: null,
        Id: null,
        Riga: null,
        Colonna: null,
        EspansioneRiga: null,
        EspansioneColonna: null,
        RigaMobile: null,
    };

    contenuto = {};

    textTab = {
        TipoPosizione: null,
        Sopra: null,
        Sotto: null,
        Destra: null,
        Sinistra: null
    };

    eventsTab = {
        Hover: null
    };

    styleTab = {
        Altezza: null,
        Larghezza: null,
        MargineTotale: null,
        MargineSopra: null,
        MargineDestra: null,
        MargineSotto: null,
        MargineSinistra: null,
        Background: null,
        TextColor: null,
        FontFamily: null,
        FontSize: null,
        PaddingTotale: null,
        PaddingSopra: null,
        PaddingDestra: null,
        PaddingSotto: null,
        PaddingSinistra: null 
    };

    mobileStyleTab = {
        Altezza: null,
        Larghezza: null,
        MargineTotale: null,
        MargineSopra: null,
        MargineDestra: null,
        MargineSotto: null,
        MargineSinistra: null,
        Background: null,
        TextColor: null,
        FontFamily: null,
        FontSize: null,
        PaddingTotale: null,
        PaddingSopra: null,
        PaddingDestra: null,
        PaddingSotto: null,
        PaddingSinistra: null
     };

     htmlConfiguration = {
         text: null
     };

     galleryConfiguration = {

        source: null,

        showIndicator: null,
        
        showNavButtons: null,
        
        enableLoop: null,
        
        slideShowDelay: null,
        
        serverSideScalingEnabled: null,
        
        cacheEnabled: null

   }

   videoConfiguration = {

        source: null,

        width: null,

        height: null,

        enableLoop: null,

        enableAutoplay: null,

        disableControls: null,
    
        responsive: null
        
   }

   showcaseConfiguration = {

        source: null,

        showcaseId: null,

        options: null
        
   }


   pdfConfiguration = {

       source: null

   }


   webPageConfiguration = {
       
       source: null

   }


   mapConfiguration = {

        latitude: null,

        longitude: null,

        zoom: null,

        styles: null,

        icon: null
        
   }


   horizontalScrollGalleryConfiguration = {
       
        source: null

   }


   gridGalleryConfiguration = {
       
        source: null

   }

   
    
     bindData() {
        this.propertyTab.Id = this.widget.id ? this.widget.id : "";
        this.propertyTab.Riga = this.widget.row;
        this.propertyTab.Colonna = this.widget.column;
        this.propertyTab.EspansioneRiga = this.widget.rowSpan;
        this.propertyTab.EspansioneColonna = this.widget.columnSpan;
        this.propertyTab.Tipo = this.widget.type;
        this.propertyTab.RigaMobile = this.widget.mobileRow;


        this.textTab.TipoPosizione = (this.widget.text?.position?.type != null) ? this.widget.text.position.type : null;
        this.textTab.Sopra = (this.widget.text?.position?.top != null) ? this.widget.text.position.top : null;
        this.textTab.Sotto = (this.widget.text?.position?.bottom != null) ? this.widget.text.position.bottom : null;
        this.textTab.Destra = (this.widget.text?.position?.right != null) ? this.widget.text.position.right : null;
        this.textTab.Sinistra = (this.widget.text?.position?.left != null) ? this.widget.text.position.left : null;


        this.eventsTab.Hover = this.widget.Hover ? this.widget.Hover : null;


        this.styleTab.Larghezza = this.widget.style?.width ? this.widget.style?.width : null; 
        this.styleTab.Altezza = this.widget.style?.height ? this.widget.style?.height : null; 
        this.styleTab.MargineTotale = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null; 
        this.styleTab.MargineSopra = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.styleTab.MargineDestra = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.styleTab.MargineSotto = this.widget.style?.margin?.bottom ? this.widget.style?.margin?.bottom : null;
        this.styleTab.MargineSinistra = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.styleTab.PaddingTotale = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null; 
        this.styleTab.PaddingSopra = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null; 
        this.styleTab.PaddingDestra = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null; 
        this.styleTab.PaddingSotto = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null; 
        this.styleTab.PaddingSinistra = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null; 
        this.styleTab.Background = this.widget.style?.background ? this.widget.style?.background : null;
        this.styleTab.TextColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.styleTab.FontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.styleTab.FontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;



        this.mobileStyleTab.Larghezza = this.widget.style?.width ? this.widget.style?.width : null; 
        this.mobileStyleTab.Altezza = this.widget.style?.height ? this.widget.style?.height : null; 
        this.mobileStyleTab.MargineTotale = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null; 
        this.mobileStyleTab.MargineSopra = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.mobileStyleTab.MargineDestra = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.mobileStyleTab.MargineSotto = this.widget.style?.margin?.bottom ? this.widget.style?.margin?.bottom : null;
        this.mobileStyleTab.MargineSinistra = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.mobileStyleTab.PaddingTotale = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null; 
        this.mobileStyleTab.PaddingSopra = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null; 
        this.mobileStyleTab.PaddingDestra = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null; 
        this.mobileStyleTab.PaddingSotto = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null; 
        this.mobileStyleTab.PaddingSinistra = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null; 
        this.mobileStyleTab.Background = this.widget.style?.background ? this.widget.style?.background : null;
        this.mobileStyleTab.TextColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.mobileStyleTab.FontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.mobileStyleTab.FontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;


        switch (this.widget.type) {
            case 0:
                this.htmlConfiguration.Testo = this.widget.content.text;
                break;
            case 1:
                for (const [key, value] of Object.entries(this.widget.content))
                if (key == "showIndicator" || key == "showNavButtons" || key == "enableLoop" || key == "slideShowDelay" || key == "serverSideScalingEnabled" || key == "cacheEnabled" || key == "source")
                    this.galleryConfiguration[key.toString()] = value;
                break;
            case 2:
                for (const [key, value] of Object.entries(this.widget.content))
                if (key == "width" || key == "height" || key == "enableLoop" || key == "enableAutoplay" || key == "disableControls" || key == "responsive" || key == "source")
                    this.videoConfiguration[key] = value;
                break;
            case 3:
                this.pdfConfiguration.source = this.widget.content.source ? this.widget.content.source : null; 
                break;
            case 4:
                for (const [key, value] of Object.entries(this.widget.content))
                if (key == "showCaseId" || key == "options" || key == "source")
                    this.showcaseConfiguration[key] = value;
                break;
            case 5:
                for (const [key, value] of Object.entries(this.widget.content))
                if (key == "latitude" || key == "longitude" || key == "zoom" || key == "styles" || key == "icon" || key == "responsive")
                    this.mapConfiguration[key] = value;
                break;
            case 6:
                this.webPageConfiguration.source = this.widget.content.source ? this.widget.content.source : null;
                break;
            case 101:
                this.horizontalScrollGalleryConfiguration.source = this.widget.content.source ? this.widget.content.source : null;
                break;
            case 102:
                this.gridGalleryConfiguration.source = this.widget.content.source ? this.widget.content.source : null;
                break;
            default:
                break;
        }
     }
}