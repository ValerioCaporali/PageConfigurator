import FormData from "./formData.js";
import SaveManager from "./save-manager.js"
import Widget from "./widget.js";
export default class ModifyManager {
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
    borders_config = [
        {
            icon: "fullscreen",
            style: "fullscreen",
            hint: "Bordo totale",
        },
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
    selectedPage;
    text_content_id;
    text_id;
    groupValueIds;
    borders = [];
    mobileBorders = [];
    newFormData;

    constructor(widget, selectedPage, text_content_id, text_id) {
        this.widget = widget;
        this.selectedPage = selectedPage;
        this.text_content_id = text_content_id;
        this.text_id = text_id;

    }

    initHtmlEditors(selector) {
        tinymce.init({
            selector: "#" + selector,
            plugins:
                "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons'",
            toolbar:
                "a11ycheck addcomment showcomments casechange checklist code export formatpainter pageembed permanentpen table",
            toolbar_mode: "floating",
            force_br_newlines : false,
            force_p_newlines : false,
            forced_root_block : '',
            tinycomments_mode: "embedded",
            height: "400",
            content_css: "../css/configurator-style.css",
            strict_loading_mode : true
        });
        $(document).on('focusin', function(e) {
            if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
            }
        });
    }

    resetHtmlEditors() {
        if (tinymce.get("value")) 
            tinymce.get("value").setContent("");
    }

    initPanel() {
        var widget = this.widget
        this.resetPanel();
        this.resetBordersButton();
        tinymce.remove();
        var formData = new FormData(widget, this.selectedPage);

        /* Metadata Tab */

        $(() => {
            let items = [];
            var that = this;
            $.each( formData.metadataTab, function( key, value ) {
                if (key != "language" && key != "description" && key != "slug")
                    items.push({dataField: key.toString(), validationRules: [{type: "required"}]})
                else
                    items.push({dataField: key.toString()})
            },),
            $('#metadata').dxForm({
              colCount: 2,
              formData: formData.metadataTab,
              items: items,
              labelLocation: "top",
            });  
        });

        /* Properties Tab */

        $(() => {
            let items = [];
            var that = this;
            $.each( formData.propertyTab, function( key, value ) {
                if (key == "row" || key == "column")
                    items.push({dataField: key.toString(), validationRules: [{type: "required"}]})
                else if (key == "type")
                    items.push({dataField: "type", editorType: 'dxSelectBox', editorOptions: {items: formData.Type, value: formData.Type[value].value, valueExpr: 'value', displayExpr: 'name', onSelectionChanged(e) {that.updateContentTab(e.selectedItem.value)}, disabled: true}, validationRules: [{type: "required"}]});
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
                (key != "positionType") ? items.push({dataField: key}) : items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.TextPosition, value: ((value || value == 0) ? formData.TextPosition[value]?.value : ""), valueExpr: 'value', displayExpr: 'name'}})
            },),
            $('#text').dxForm({
              colCount: 2,
              formData: formData.textTab,
              items: items,
              labelLocation: "top",
            });
        });

            let textareaa = document.createElement("textarea");
            textareaa.id = this.text_id;
            document.getElementById("text-editor-container-12").appendChild(textareaa);
            setTimeout(() => {
                textareaa.innerHTML = this.widget.text?.value ? this.widget.text.value : "";
                this.initHtmlEditors(this.text_id);
            }, 200)


        /* Events Tab */
        $(() => {
            let items = [];
            $.each( formData.eventsTab, function( key, value ) {
                items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.Hover, value: ((value || value == 0) ? formData.Hover[value].value : ""), valueExpr: 'value', displayExpr: 'name'}});
            },),
            $('#events-checkbox').dxForm({
              colCount: 2, 
              formData: formData.eventsTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            var that = this;
            $.each( formData.caType, function( key, value ) {
                let currValue = (value > 3) ? (value < 1) : value
                items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.ClickActionType, value: ((currValue || currValue == 0) ? formData.ClickActionType[currValue]?.value : null), valueExpr: 'value', displayExpr: 'name', onSelectionChanged(e) {that.updateClickAction(e.selectedItem?.value)}}});
            },);
            $('#ca-type').dxForm({
              colCount: 2, 
              formData: formData.caType,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.link, function( key, value ) {
                if (key == "url")
                    items.push({dataField: key});
                else items.push({dataField: key, editorType: "dxCheckBox", value: value});
            },);
            $('#ca-0').dxForm({
              colCount: 2, 
              formData: formData.link,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.catalog, function( key, value ) {
                if (key != "groupValueIds")
                    items.push({dataField: key});
                else
                    items.push({dataField: key, editorType: "dxTextArea"})
            },);
            $('#ca-1').dxForm({
              colCount: 1, 
              formData: formData.catalog,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.salesCampaign, function( key, value ) {
                items.push({dataField: key});
            },);
            $('#ca-2').dxForm({
              colCount: 2, 
              formData: formData.salesCampaign,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each( formData.scrollToWidget, function( key, value ) {
                items.push({dataField: key});
            },);
            $('#ca-4').dxForm({
              colCount: 1, 
              formData: formData.scrollToWidget,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {   
            let that = this;
            var a = $('#ca-5').dxDataGrid({
              dataSource: formData.multipleCatalog.actions,
              showBorders: false,
              paging: {
                enabled: false,
              },
              editing: {
                mode: 'row',
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
              },
              columns: [
                'groupId', 
                'groupValueId',
                {
                  dataField: 'groupValueIds',
                  width: '50%',
                }
              ],
              onContentReady(e) {
                  that.groupValueIds = e.component.getDataSource().items();
              }
            });
        });        
        $(() => {
            let items = [];
            $.each( formData.dialog, function( key, value ) {
                items.push({dataField: key});
            },);
            $('#ca-6').dxForm({
              colCount: 1, 
              formData: formData.dialog,
              items: items,
              labelLocation: "top",
            });
        });
        
        /* ---------------- */

        /* Style Tab */
        $(() => {
            let items = [];
            $.each( formData.styleTab, function( key, value ) {
                if (key == "height" || key == "width")
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
                if (key.indexOf("margin") != -1)
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
                if (key.indexOf("padding") != -1)
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
                if (key == "background")
                    items.push({dataField: key});
                else if(key == "textColor") {
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
                if (key.indexOf("font") != -1)
                    items.push({dataField: key});
            },),
            $('#font').dxForm({
              colCount: 2, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each(formData.styleTab, function (key, value) {
                if (key.indexOf("border") != -1)
                    items.push({ dataField: key });
            }),
                $('#border-properties').dxForm({
                    colCount: 3,
                    formData: formData.styleTab,
                    items: items,
                    labelLocation: "top",
                });
        });


        /* Mobile Style Tab */
        $(() => {
            let items = [];
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key == "height" || key == "width")
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
                if (key.indexOf("margin") != -1)
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
                if (key.indexOf("padding") != -1)
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
                if (key == "background")
                    items.push({dataField: key});
                else if(key == "textColor") {
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
                if (key.indexOf("font") != -1)
                    items.push({dataField: key});
            },),
            $('#mobile-font').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
            });
        });
        $(() => {
            let items = [];
            $.each(formData.mobileStyleTab, function (key, value) {
                if (key.indexOf("border") != -1)
                    items.push({ dataField: key });
            }),
                $('#mobile-border-properties').dxForm({
                    colCount: 3,
                    formData: formData.mobileStyleTab,
                    items: items,
                    labelLocation: "top",
                });
        });

        this.initBordersButton();

        // Content Tab
        if (this.widget.type == 0) {
            document.getElementById(this.widget.type).style.display = "block";
            let textarea = document.createElement("textarea");
            textarea.id = this.text_content_id;
            document.getElementById("0").appendChild(textarea);
            setTimeout(() => {
                textarea.innerHTML = this.widget.content.text;
                this.initHtmlEditors(this.text_content_id);
            }, 200)
        } else {
            let textarea = document.createElement("textarea");
            textarea.id = this.text_content_id;
            document.getElementById("0").appendChild(textarea);
            setTimeout(() => {
                textarea.innerHTML = this.widget.content.text;
                this.initHtmlEditors(this.text_content_id);
            }, 200)
        }

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
                            items.push({dataField: key, editorType: "dxCheckBox", value: value});
                        else if(key == "slideShowDelay") items.push({dataField: key});
                    },),
                    $('#gallery-content').dxForm({
                      colCount: 4,
                      formData: formData.galleryConfiguration,
                      items: items,
                      labelLocation: "left",
                    });
                });
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
                            items.push({dataField: key, editorType: "dxCheckBox", value: value});
                        else if(key != "content") items.push({dataField: key});
                    },),
                    $('#video-content').dxForm({
                      colCount: 4,
                      formData: formData.videoConfiguration,
                      items: items,
                      labelLocation: "left",
                    });
                });

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

        this.newFormData = formData;

    }

    initBordersButton() {

        var that = this;

        $("#border-selection").dxButtonGroup({
            items: this.borders_config,
            keyExpr: "style",
            stylingMode: "text",
            selectionMode: "multiple",
            selectedItemKeys: this.initBorders(),
            onSelectionChanged: function(e) {
                if (e.addedItems.length > 0) {
                    if (e.addedItems[0].style == "fullscreen") {
                        that.borders = [];
                    } else if (e.addedItems[0].style && that.borders.indexOf("fullscreen") != -1) {
                        that.borders = that.borders.filter(border => border != "fullscreen")
                    }
                    that.borders.push(e.addedItems[0].style)
                    $("#border-selection").dxButtonGroup({ 
                        selectedItemKeys: that.borders
                    });
                } else if (e.removedItems.length > 0) {
                    that.borders = that.borders.filter(border => border != e.removedItems[0].style);
                    $("#border-selection").dxButtonGroup({ 
                        selectedItemKeys: that.borders
                    });
                }
            }
        });

        $("#mobile-border-selection").dxButtonGroup({
            items: this.borders_config,
            keyExpr: "style",
            stylingMode: "text",
            selectionMode: "multiple",
            selectedItemKeys: this.initMobileBorders(),
            onSelectionChanged: function(e) {
                if (e.addedItems.length > 0) {
                    if (e.addedItems[0].style == "fullscreen") {
                        that.mobileBorders = [];
                    } else if (e.addedItems[0].style && that.mobileBorders.indexOf("fullscreen") != -1) {
                        that.mobileBorders = that.mobileBorders.filter(border => border != "fullscreen")
                    }
                    that.mobileBorders.push(e.addedItems[0].style)
                    $("#mobile-border-selection").dxButtonGroup({ 
                        selectedItemKeys: that.mobileBorders
                    });
                } else if (e.removedItems.length > 0) {
                    that.mobileBorders = that.mobileBorders.filter(border => border != e.removedItems[0].style);
                    $("#mobile-border-selection").dxButtonGroup({ 
                        selectedItemKeys: that.mobileBorders
                    });
                }
            }
        });

    }

    initBorders() {

        if (this.widget.style?.borders) {
            this.widget.style.borders.forEach(border => {
                switch (border.type) {
                    case 0:
                        this.borders.push('fullscreen');
                        break;
                    case 1:
                        this.borders.push('arrowleft');
                        break;
                    case 2:
                        this.borders.push('arrowright');
                        break;
                    case 3:
                        this.borders.push('arrowup');
                        break;
                    case 4:
                        this.borders.push('arrowdown');
                        break;
                
                    default:
                        break;
                }
            });
        }
    
    return this.borders;

    }

    initMobileBorders() {

        if (this.widget.mobileStyle?.borders) {
            this.widget.mobileStyle.borders.forEach(border => {
                switch (border.type) {
                    case 0:
                        this.mobileBorders.push('fullscreen');
                        break;
                    case 1:
                        this.mobileBorders.push('arrowleft');
                        break;
                    case 2:
                        this.mobileBorders.push('arrowright');
                        break;
                    case 3:
                        this.mobileBorders.push('arrowup');
                        break;
                    case 4:
                        this.mobileBorders.push('arrowdown');
                        break;
                
                    default:
                        break;
                }
            });
        }
    
        return this.mobileBorders;

    }

    resetBordersButton() {

        $("#border-selection").dxButtonGroup({
            selectedItemKeys: []
        });

        $("#mobile-border-selection").dxButtonGroup({
            selectedItemKeys: []
        });

    }

    updateContentTab(type) {
        for (const [key, value] of Object.entries(this.widgetIndex)) {
            document.getElementById(key.toString()).style.display = "none";
        }
        document.getElementById(type.toString()).style.display = "block";
    }
    
    updateClickAction(type) {
        for (let i = 0; i <= 6; i++) {
            if (i != 3)
                document.getElementById("ca-" + i).style.display = "none"
        }
        let container = document.getElementById("ca-" + type?.toString());
        if (container)
            container.style.display = "block";
    }

    resetPanel() {

        for (const [key, value] of Object.entries(this.widgetIndex)) {
            document.getElementById(key.toString()).style.display = "none";
        }
        
        for (let i = 0; i <= 6; i++) {
            if (i != 3)
                document.getElementById("ca-" + i).style.display = "none"
        }
        
        if (this.widget.clickAction)
            document.getElementById("ca-" + this.widget.clickAction.type).style.display = "block";
        
        document.getElementById(this.widget.type.toString()).style.display = "block";

    }

    getUpdatedPage() {

        let initialWidget = this.widget;
        let widget = new Widget(this.newFormData, this.text_content_id, this.text_id, this.borders, this.mobileBorders, this.groupValueIds);
        let modifiedWidget = widget.widgetBinding();
        let saveManager = new SaveManager(modifiedWidget, initialWidget, this.selectedPage, this.newFormData.metadataTab);
        let updatedPage = saveManager.updatePage();
        if (updatedPage)
            return updatedPage;
        
    }

}
