import FormData from "./configurations/formData.js";
export default class Modifier {
    widgetIndex = {
        0: "Testo",
        1: "Galleria",
        2: "Video",
        3: "Pdf",
        4: "Tour",
        5: "Mappa",
        6: "Pagina web",
        101: "Galleria orizzontale",
        102: "Galleria a griglia",
    };
    borders = [
        {
            icon: "arrowup",
            style: "arrowup",
            hint: "Bordo alto",
        },
        {
            icon: "arrowright",
            style: "arrowright",
            hint: "Bordo destro",
        },
        {
            icon: "arrowdown",
            style: "arrowdown",
            hint: "Bordo basso",
        },
        {
            icon: "arrowleft",
            style: "arrowleft",
            hint: "Bordo sinistro",
        },
    ];
    widget;

    constructor(widget) {
        this.widget = widget;
        this.resetHtmlEditors();
        this.initPanel(this.widget);
        document.getElementById("save-widget-changes-button").addEventListener("click", () => {
            this.saveWidget(this.widget);
        });
    }

    initHtmlEditors(selector) {
        tinymce.init({
            selector: "#" + selector,
            plugins:
                "a11ychecker advcode casechange export formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker",
            toolbar:
                "a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table",
            toolbar_mode: "floating",
            tinycomments_mode: "embedded",
            height: "400",
            content_css: "../css/configurator-style.css",
            strict_loading_mode : true
        });
    }

    resetHtmlEditors() {
        if (tinymce.get("value")) 
            tinymce.get("value").setContent("");
    }

    initPanel(widget) {
        this.resetPanel();
        this.resetBordersButton();
        var formData = new FormData(widget);

        /* Properties Tab */
        $(() => {
            let items = [];
            $.each( formData.propertyTab, function( key, value ) {
                if (key == "Riga" || key == "Colonna")
                    items.push({dataField: key.toString(), validationRules: [{type: "required"}]})
                else if (key == "Tipo")
                    items.push({dataField: "Tipo", editorType: 'dxSelectBox', editorOptions: {items: formData.Type, value: formData.Type[value]}, validationRules: [{type: "required"}]});
                else items.push({dataField: key.toString()})
            },),
            $('#properties').dxForm({
              colCount: 2,
              formData: formData.propertyTab,
              items: items,
              labelLocation: "top",
            });  
        });

        /* Text Tab */
        $(() => {
            let items = [];
            $.each( formData.textTab, function( key, value ) {
                (key != "TipoPosizione") ? items.push({dataField: key}) : items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.TextPosition, value: formData.TextPosition[value]}})
            },),
            $('#text').dxForm({
              colCount: 2,
              formData: formData.textTab,
              items: items,
              labelLocation: "top",
            });
        });

        if (this.widget.text?.value) {
            if (!tinymce.get("value")) {
                document.getElementById("value").innerHTML = this.widget.text?.value.toString();
                this.initHtmlEditors("value");   
            } else tinymce.get("value").setContent(this.widget.text?.value.toString());
        } else {
            if (!tinymce.get("value")) {
                document.getElementById("value").innerHTML = "";
                this.initHtmlEditors("value");   
            } else tinymce.get("value").setContent("");
        }

        

        /* Events Tab */
        $(() => {
            let items = [];
            $.each( formData.eventsTab, function( key, value ) {
                items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.Hover, value: formData.Hover[value]}});
            },),
            $('#events').dxForm({
              colCount: 2, 
              formData: formData.eventsTab,
              items: items,
              labelLocation: "top",
            });
        });
        // to-do: handle click action
        /* ---------------- */

        /* Style Tab */
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key == "Altezza" || key == "Larghezza")
                items.push({dataField: key});
            },),
            $('#dimensions').dxForm({
              colCount: 2, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key.indexOf("Margine") != -1)
                    items.push({dataField: key});
            },),
            $('#margin').dxForm({
              colCount: 5, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key.indexOf("Padding") != -1)
                    items.push({dataField: key});
            },),
            $('#padding').dxForm({
              colCount: 5, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key == "Background")
                    items.push({dataField: key});
                else if(key == "TextColor") {
                    items.push({dataField: key, editorType: "dxColorBox"});
                }
            },),
            $('#more').dxForm({
              colCount: 2, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key.indexOf("Font") != -1)
                    items.push({dataField: key});
            },),
            $('#font').dxForm({
              colCount: 2, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });


        /* Mobile Style Tab */
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key == "Altezza" || key == "Larghezza")
                items.push({dataField: key});
            },),
            $('#mobile-dimensions').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key.indexOf("Margine") != -1)
                    items.push({dataField: key});
            },),
            $('#mobile-margin').dxForm({
              colCount: 5, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key.indexOf("Padding") != -1)
                    items.push({dataField: key});
            },),
            $('#mobile-padding').dxForm({
              colCount: 5, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key == "Background")
                    items.push({dataField: key});
                else if(key == "TextColor") {
                    items.push({dataField: key, editorType: "dxColorBox"});
                }
            },),
            $('#mobile-more').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key.indexOf("Font") != -1)
                    items.push({dataField: key});
            },),
            $('#mobile-font').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });

        this.initBordersButton();

        // Content Tab
        if (this.widget.type == 0) {
            document.getElementById(this.widget.type).style.display = "block";
            if (!tinymce.get("0-text")) {
                console.log("html");
                document.getElementById("0-text").innerHTML = this.widget.content.text;
                this.initHtmlEditors("0-text");   
            } else tinymce.get("0-text").setContent(this.widget.content.text);
        } else {
            if (!tinymce.get("0-text")) {
                document.getElementById("0-text").innerHTML = "";
                this.initHtmlEditors("0-text");   
            } else tinymce.get("0-text").setContent("");
        }

        switch (this.widget.type) {
            case 1:
                $(() => {
                    let items = [];
                    $.each( formData.galleryConfiguration, function( key, value ) {
                        if (key == "source") {
                            items.push({dataField: key, editorType: "dxTextArea"});
                        }
                    },),
                    $('#gallery-source').dxForm({
                      colCount: 1,
                      formData: formData.galleryConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                $(() => {
                    let items = [];
                    $.each( formData.galleryConfiguration, function( key, value ) {
                        if (key != "slideShowDelay" && key != "source")
                            items.push({dataField: key, editorType: "dxCheckBox"});
                        else if(key == "slideShowDelay") items.push({dataField: key});
                    },),
                    $('#gallery-content').dxForm({
                      colCount: 4,
                      formData: formData.galleryConfiguration,
                      items: items,
                      labelLocation: "left",
                    });
                });
                break;

            case 2:
                $(() => {
                    let items = [];
                    $.each( formData.videoConfiguration, function( key, value ) {
                        if (key == "source") {
                            items.push({dataField: key, editorType: "dxTextArea"});
                        }
                    },),
                    $('#video-source').dxForm({
                      colCount: 1,
                      formData: formData.videoConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                $(() => {
                    let items = [];
                    $.each( formData.videoConfiguration, function( key, value ) {
                        if (key != "width" && key != "height" && key != "source")
                            items.push({dataField: key, editorType: "dxCheckBox"});
                        else if(key != "content") items.push({dataField: key});
                    },),
                    $('#video-content').dxForm({
                      colCount: 4,
                      formData: formData.videoConfiguration,
                      items: items,
                      labelLocation: "left",
                    });
                });
                break;

            case 3:
                $(() => {
                    let items = [];
                    $.each( formData.pdfConfiguration, function( key, value ) {
                        items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#pdf-source').dxForm({
                      colCount: 1,
                      formData: formData.pdfConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            case 4:
                $(() => {
                    let items = [];
                    $.each( formData.showcaseConfiguration, function( key, value ) {
                        if (key == "source")
                            items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#showcase-source').dxForm({
                      colCount: 1,
                      formData: formData.showcaseConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                $(() => {
                    let items = [];
                    $.each( formData.showcaseConfiguration, function( key, value ) {
                        if (key != "source")
                            items.push({dataField: key});
                    },),
                    $('#showcase-content').dxForm({
                      colCount: 2,
                      formData: formData.showcaseConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            case 5:
                $(() => {
                    let items = [];
                    $.each( formData.mapConfiguration, function( key, value ) {
                        items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#map-content').dxForm({
                      colCount: 2,
                      formData: formData.mapConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            case 6:
                $(() => {
                    let items = [];
                    $.each( formData.webPageConfiguration, function( key, value ) {
                        items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#webpage-source').dxForm({
                      colCount: 1,
                      formData: formData.webPageConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            case 101:
                $(() => {
                    let items = [];
                    $.each( formData.horizontalScrollGalleryConfiguration, function( key, value ) {
                        items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#horizontalScrollGallery-source').dxForm({
                      colCount: 1,
                      formData: formData.horizontalScrollGalleryConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            case 102:
                $(() => {
                    let items = [];
                    $.each( formData.gridGalleryConfiguration, function( key, value ) {
                        items.push({dataField: key, editorType: "dxTextArea"});
                    },),
                    $('#gridGallery-source').dxForm({
                      colCount: 1,
                      formData: formData.gridGalleryConfiguration,
                      items: items,
                      labelLocation: "top",
                    });
                });
                break;
            default:
                break;
        }





        // this.resetPanel();
        // this.restHtmlEditors();
        // this.resetBordersButton();
        // this.initCommonSettingsPanel(widget);
        // document.getElementById("modify-modal-title").innerHTML = this.widgetIndex[widget.type];
        // document.getElementById(widget.type).style.display = "block";
        // for (const [key, value] of Object.entries(widget.content)) {
        //     if (key.toString() == "text" && value) {
        //         this.initHtmlEditors("0-text");
        //         tinymce.get("0-text").setContent(value);
        //     }
        //     if (
        //         document.getElementById(
        //             widget.type.toString() + "-" + key.toString()
        //         ) &&
        //         value
        //     ) {
        //         if (value == true || value == false) {
        //             document.getElementById(
        //                 widget.type.toString() + "-" + key.toString()
        //             ).checked = value;
        //         }
        //         document.getElementById(
        //             widget.type.toString() + "-" + key.toString()
        //         ).value = value;
        //     }
        // }
    }

    initBordersButton() {
        $("#border-selection").dxButtonGroup({
            items: this.borders,
            keyExpr: "style",
            stylingMode: "outlined",
            selectionMode: "multiple",
            onItemClick(e) {
                DevExpress.ui.notify(
                    {
                        message: `The "${e.itemData.hint}" button was clicked`,
                        width: 320,
                    },
                    "success",
                    1000
                );
            },
        });
    }

    resetBordersButton() {
        $("#border-selection").dxButtonGroup({
            selectedItemKeys: []
        });
    }

    resetPanel() {
        for (const [key, value] of Object.entries(this.widgetIndex)) {
            document.getElementById(key.toString()).style.display = "none";
        }
        document.getElementById(this.widget.type.toString()).style.display = "block";
    }

    saveWidget() {
        // salvataggio del widget (in locale)
    }
}
