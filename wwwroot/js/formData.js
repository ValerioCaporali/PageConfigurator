export default class FormData {

    widget;

    constructor (widget) {
        this.widget = widget;
        this.bindData();
    }

    Type = [

        { name: "Testo", value: 0 },

        { name: "Galleria", value: 1 },

        { name: "Video", value: 2 },

        { name: "Pdf", value: 3 },

        { name: "Tour", value: 4 },

        { name: "Mappa", value: 5 },

        { name: "Pagina Web", value: 6 },

        { name: "Galleria orrizzontale", value: 101 },

        { name: "Galleria a griglia", value: 102 }

    ]

    TextPosition = [

        { name: "Centrato", value: 0 },

        { name: "Assoluto", value: 1}

    ]

    Hover = [

        { name: "none", value: 0 },

        { name: "default", value: 1 },

        { name: "underline", value: 2 },

        { name: "expand", value: 3 }

    ]

    propertyTab = {

        type: null,

        id: null,

        row: null,

        column: null,

        rowSpan: null,

        columnnSpan: null,

        mobileRow: null,

    };

    contenuto = {};

    textTab = {

        positionType: null,

        top: null,

        bottom: null,

        right: null,

        left: null

    };

    eventsTab = {

        Hover: null
        
    };

    styleTab = {
        
        height: null,
        
        width: null,
        
        marginTotal: null,
        
        marginTop: null,
        
        marginRight: null,
        
        marginBottom: null,
        
        marginLeft: null,
        
        background: null,
        
        textColor: null,
        
        fontFamily: null,
        
        fontSize: null,
        
        paddingTotal: null,
        
        paddingTop: null,
        
        paddingRight: null,
        
        paddingBottom: null,
        
        paddingLeft: null
        
    };

    mobileStyleTab = {

        height: null,

        width: null,

        marginTotal: null,

        marginTop: null,

        marginRight: null,

        marginBottom: null,

        marginLeft: null,

        background: null,

        textColor: null,

        fontFamily: null,

        fontSize: null,

        paddingTotal: null,

        paddingTop: null,

        paddingRight: null,

        paddingBottom: null,

        paddingLeft: null

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
        this.propertyTab.id = this.widget.id ? this.widget.id : "";
        this.propertyTab.row = this.widget.row;
        this.propertyTab.column = this.widget.column;
        this.propertyTab.rowSpan = this.widget.rowSpan;
        this.propertyTab.columnSpan = this.widget.columnSpan;
        this.propertyTab.type = this.widget.type;
        this.propertyTab.mobileRow = this.widget.mobileRow;


        this.textTab.positionType = (this.widget.text?.position?.type != null) ? this.widget.text.position.type : null;
        this.textTab.top = (this.widget.text?.position?.top != null) ? this.widget.text.position.top : null;
        this.textTab.bottom = (this.widget.text?.position?.bottom != null) ? this.widget.text.position.bottom : null;
        this.textTab.right = (this.widget.text?.position?.right != null) ? this.widget.text.position.right : null;
        this.textTab.left = (this.widget.text?.position?.left != null) ? this.widget.text.position.left : null;

        this.eventsTab.Hover = this.widget.hover ? this.widget.hover : null;


        this.styleTab.width = this.widget.style?.width ? this.widget.style?.width : null; 
        this.styleTab.height = this.widget.style?.height ? this.widget.style?.height : null; 
        this.styleTab.marginTotal = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null; 
        this.styleTab.marginTop = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.styleTab.marginRight = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.styleTab.marginLeft = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.styleTab.paddingTotal = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null;
        this.styleTab.paddingTop = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null;
        this.styleTab.paddingRight = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null;
        this.styleTab.paddingBottom = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null;
        this.styleTab.paddingLeft = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null;
        this.styleTab.background = this.widget.style?.background ? this.widget.style?.background : null;
        this.styleTab.textColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.styleTab.fontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.styleTab.fontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;



        this.mobileStyleTab.width = this.widget.style?.width ? this.widget.style?.width : null;
        this.mobileStyleTab.height = this.widget.style?.height ? this.widget.style?.height : null;
        this.mobileStyleTab.marginTotal = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null;
        this.mobileStyleTab.marginTop = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.mobileStyleTab.marginRight = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.mobileStyleTab.marginBottom = this.widget.style?.margin?.bottom ? this.widget.style?.margin?.bottom : null;
        this.mobileStyleTab.marginLeft = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.mobileStyleTab.paddingTotal = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null;
        this.mobileStyleTab.paddingTop = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null;
        this.mobileStyleTab.paddingRight = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null;
        this.mobileStyleTab.paddingBottom = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null;
        this.mobileStyleTab.paddingLeft = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null;
        this.mobileStyleTab.background = this.widget.style?.background ? this.widget.style?.background : null;
        this.mobileStyleTab.textColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.mobileStyleTab.fontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.mobileStyleTab.fontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;


        switch (this.widget.type) {
            
            case 0:
                this.htmlConfiguration.text = this.widget.content.text;
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