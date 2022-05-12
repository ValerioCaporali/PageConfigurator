export default class FormData {

    widget;
    selectedPage;

    constructor (widget, selectedPage) {
        this.widget = widget;
        this.selectedPage = selectedPage;
        this.bindData();
    }

    gallerySourceInput = {
        url: null
    }
    
    horizontalScrollGallerySourceInput = {
        url: null
    }
    gridGallerySourceInput = {
        url: null
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

    Visibility = [

        {value: 0, text: "Public"},

        {value: 1, text: "Private"}
        
    ]

    Language = [

        {value: "null", text: "Default", disabled: true},

        {value: "it", text: "Italiano"},

        {value: "en", text: "Inglese"},

        {value: "es", text: "Spagnolo"},

        {value: "fr", text: "Francese"},

        {value: "de", text: "Tedesco"}

    ]

    TextPosition = [

        { name: "Centrato", value: 0 },

        { name: "Assoluto", value: 1}

    ]
    
    Borders = [ 
        
        {value: "dotted"},
        
        {value: "dashed"},
        
        {value: "solid"},
        
        {value: "double"},
        
        {value: "groove"},
        
        {value: "ridge"},
        
        {value: "inset"},
        
        {value: "outset"},
        
        {value: "none"},
        
        {value: "hidden"}
        
    ]

    Hover = [

        { name: "none", value: 0 },

        { name: "default", value: 1 },

        { name: "underline", value: 2 },

        { name: "expand", value: 3 }

    ]
    
    ClickActionType = [

        { name: "Link", value: 0 },

        { name: "Catalog", value: 1 },

        { name: "Sales Campaign", value: 2 },

        { name: "Scroll to widget", value: 4 },
        
        { name: "Multiple Catalog", value: 5 },
        
        { name: "Dialog", value: 6 }

    ]

    metadataTab = {

        visibility: null,

        slug: null,

        description: null,

        language: null,

        title: null
        
    }

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

        Hover: null,        
        
    };
    
    caType = {
        
        clickActionType: null
        
    }
    
    link = {
        
        url: null,
        
        external: null
        
    }
    
    catalog = {
        
        groupId: null,
        
        groupValueId: null,
        
        groupValueIds: []
        
    }
    
    salesCampaign = {
        
        salesCampaignId: null
        
    }
    
    scrollToWidget = {
        
        destinationWidget: null
        
    }
    
    multipleCatalog = {
        
        actions: []

    }
    
    dialog = {
        
        content: null
        
    }

    margin = {
        
        total: null,

        top: null,

        right: null,

        bottom: null,

        left: null

    }

    mobileMargin = {
        
        total: null,

        top: null,

        right: null,

        bottom: null,

        left: null

    }

    padding = {
        
        total: null,

        top: null,

        right: null,

        bottom: null,

        left: null

    }

    mobilePadding = {
        
        total: null,

        top: null,

        right: null,

        bottom: null,

        left: null

    }

    styleTab = {
        
        height: null,
        
        width: null,
        
        marginLeft: null,
        
        background: null,
        
        textColor: null,
        
        fontFamily: null,
        
        fontSize: null,

        borderStyle: "solid",

        borderWidth: "1px",

        borderColor: "black"
        
    };

    mobileStyleTab = {

        height: null,

        width: null,

        background: null,

        textColor: null,

        fontFamily: null,

        fontSize: null,

        borderStyle: "solid",

        borderWidth: "1px",

        borderColor: "black"

     };

     htmlConfiguration = {

         text: null

     };

     galleryConfiguration = {

        slideShowDelay: null,

        source: null,

        showIndicator: false,
        
        showNavButtons: false,
        
        enableLoop: false,
        
        serverSideScalingEnabled: false,
        
        cacheEnabled: false,
        
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
         
        this.metadataTab.visibility = this.selectedPage.contents.visibility;
        this.metadataTab.slug = this.selectedPage.contents.slug;
        this.metadataTab.description = this.selectedPage.contents.description;
        this.metadataTab.language = this.selectedPage.contents.language;
        this.metadataTab.title = this.selectedPage.contents.title;

        this.propertyTab.id = this.widget.id;
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

        this.eventsTab.Hover = this.widget.hover != null ? this.widget.hover : null;


        this.styleTab.width = this.widget.style?.width ? this.widget.style?.width : null; 
        this.styleTab.height = this.widget.style?.height ? this.widget.style?.height : null; 
        this.margin.total = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null; 
        this.margin.top = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.margin.right = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.margin.bottom = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.margin.left = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.padding.total = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null;
        this.padding.top = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null;
        this.padding.right = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null;
        this.padding.bottom = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null;
        this.padding.left = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null;
        this.styleTab.background = this.widget.style?.background ? this.widget.style?.background : null;
        this.styleTab.textColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.styleTab.fontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.styleTab.fontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;
        if (this.widget.style?.borders) {
            this.widget.style.borders.forEach(border => {
                this.styleTab.borderStyle = border.style;
                this.styleTab.borderColor = border.color;
                this.styleTab.borderWidth = border.width;
            });
        }
        if (this.widget.clickAction) {
            
            this.caType.clickActionType = this.widget.clickAction.type;
            
            switch (this.widget.clickAction.type) {

                case 0:
                    this.link.url = this.widget.clickAction.url;
                    this.link.external = this.widget.clickAction.external ? this.widget.clickAction.external : null;
                    break;
                    
                case 1: 
                    this.catalog.groupId = this.widget.clickAction.groupId;
                    this.catalog.groupValueId = this.widget.clickAction.groupValueId ? this.widget.clickAction.groupValueId : null;
                    if (this.widget.clickAction.groupValueIds) {
                            this.widget.clickAction.groupValueIds.forEach(groupValueId => {
                                this.catalog.groupValueIds.push(groupValueId);
                            })
                    }
                    break;
                    
                case 2:
                    this.salesCampaign.salesCampaignId = this.widget.clickAction.salesCampaignId ? this.widget.clickAction.salesCampaignId : null;
                    break;
                    
                case 4:
                    this.scrollToWidget.destinationWidget = this.widget.clickAction.destinationWidgetId;
                    break;
                   
                case 5:
                    this.widget.clickAction.actions.forEach(current_action => {
                        let action = {
                            groupId: current_action.groupId,
                            groupValueId: current_action.groupValueId ? current_action.groupValueId : null,
                            groupValueIds: current_action.groupValueIds
                        }
                        this.multipleCatalog.actions.push(action);
                    });
                    break;
                                        
                case 6:
                    this.dialog.content = this.widget.clickAction.content;
                    break;
            }
        }



		this.mobileStyleTab.width = this.widget.style?.width ? this.widget.style?.width : null;
        this.mobileStyleTab.height = this.widget.style?.height ? this.widget.style?.height : null;
        this.mobileMargin.total = this.widget.style?.margin?.total ? this.widget.style?.margin?.total : null;
        this.mobileMargin.top = this.widget.style?.margin?.top ? this.widget.style?.margin?.top : null;
        this.mobileMargin.right = this.widget.style?.margin?.right ? this.widget.style?.margin?.right : null;
        this.mobileMargin.bottom = this.widget.style?.margin?.bottom ? this.widget.style?.margin?.bottom : null;
        this.mobileMargin.left = this.widget.style?.margin?.left ? this.widget.style?.margin?.left : null;
        this.mobilePadding.total = this.widget.style?.padding?.total ? this.widget.style?.padding?.total : null;
        this.mobilePadding.top = this.widget.style?.padding?.top ? this.widget.style?.padding?.top : null;
        this.mobilePadding.right = this.widget.style?.padding?.right ? this.widget.style?.padding?.right : null;
        this.mobilePadding.bottom = this.widget.style?.padding?.bottom ? this.widget.style?.padding?.bottom : null;
        this.mobilePadding.left = this.widget.style?.padding?.left ? this.widget.style?.padding?.left : null;
        this.mobileStyleTab.background = this.widget.style?.background ? this.widget.style?.background : null;
        this.mobileStyleTab.textColor = this.widget.style?.textColor ? this.widget.style?.textColor : null;
        this.mobileStyleTab.fontFamily = this.widget.style?.fontFamily ? this.widget.style?.fontFamily : null;
        this.mobileStyleTab.fontSize = this.widget.style?.fontSize ? this.widget.style?.fontSize : null;
        if (this.widget.mobileStyle?.borders) {
            this.widget.mobileStyle.borders.forEach(border => {
                this.mobileStyleTab.borderStyle = border.style;
                this.mobileStyleTab.borderColor = border.color;
                this.mobileStyleTab.borderWidth = border.width;
            });
        }


        switch (this.widget.type) {
            
            case 0:
                this.htmlConfiguration.text = this.widget.content.text;
                break;
                
            case 1:
                for (const [key, value] of Object.entries(this.widget.content))
                if (key == "showIndicator" || key == "showNavButtons" || key == "enableLoop" || key == "slideShowDelay" || key == "serverSideScalingEnabled" || key == "cacheEnabled")
                    this.galleryConfiguration[key.toString()] = value;
                else {
                    this.galleryConfiguration.source = [];
                    this.widget.content.source.forEach(currSource => {
                        let source = {
                            url: currSource,
                            thumbnail: currSource
                        }
                        this.galleryConfiguration.source.push(source);
                    });    
                }
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
                this.horizontalScrollGalleryConfiguration.source = [];
                this.widget.content.source.forEach(currSource => {
                    let source = {
                        url: currSource,
                        thumbnail: currSource
                    }
                    this.horizontalScrollGalleryConfiguration.source.push(source);
                });
                break;
                
            case 102:
                this.gridGalleryConfiguration.source = [];
                this.widget.content.source.forEach(currSource => {
                    let source = {
                        url: currSource,
                        thumbnail: currSource
                    }
                    this.gridGalleryConfiguration.source.push(source);
                });
                break;
                
            default:
                break;
        }
     }
}