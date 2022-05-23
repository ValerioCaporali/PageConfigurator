import FormData from "./formData.js";
import SaveManager from "./requests.js"
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
            icon: "../../../assets/icons/total.png",
            style: "fullscreen",
            hint: "Bordo totale",
        },
        {
            icon: "../../../assets/icons/top.png",
            style: "arrowup",
            hint: "Bordo alto",
        },
        {
            icon: "../../../assets/icons/right.png",
            style: "arrowright",
            hint: "Bordo destro",
        },
        {
            icon: "../../../assets/icons/bottom.png",
            style: "arrowdown",
            hint: "Bordo basso",
        },
        {
            icon: "../../../assets/icons/left.png",
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
    renderer;
    typingTimer;
    doneTypingInterval = 800;

    constructor(widget, selectedPage, text_content_id, text_id, renderer) {
        this.widget = widget;
        this.selectedPage = selectedPage;
        this.text_content_id = text_content_id;
        this.text_id = text_id;
        this.renderer = renderer;

    }

    initHtmlEditors(selector) {
        let that = this;
        tinymce.init({
            entity_encoding : "raw",
            verify_html : false,
            cleanup : false,
            selector: "#" + selector,
            plugins:
                "code print preview",
            toolbar:
                "code undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
            toolbar_mode: "floating",
            height: "400",
            dialog_type : "modal",
            content_css: "../../../css/configurator-style.css",
            init_instance_callback: function(editor) {
                editor.on('keyup', function(e) {
                    clearTimeout(that.typingTimer);
                    that.typingTimer = setTimeout(() => {
                        that.getUpdatedPage();
                    }, that.doneTypingInterval);
                });
                editor.on('closeWindow', function(e) {
                    that.getUpdatedPage();
                });
                editor.on('ExecCommand', function(e) {
                    that.getUpdatedPage();
                  });
              }
        }).then(() => {
            $(document).on('focusin', function(e) {
                if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
                  e.stopImmediatePropagation();
                }
            });
            let iframe = document.getElementsByTagName('iframe');
            //for(let i = 0; i < iframe.length; i++) {
            //    let innerDoc = iframe[i].contentDocument;
            //    let iframeBody = innerDoc.getElementById('tinymce');
            //    // iframeBody.style.position = "relative";
            //}
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

        /* Delete widget button */
        $(() => {
            let that = this;
            $('#delete-widget-btn').dxButton({
              stylingMode: 'contained',
              text: 'Elimina widget',
              type: 'danger',
              width: 130,
              onClick() {
                that.deleteWidget(widget);
              },
            });
        });

        /* Text Tab */
        $(() => {
            let that = this;
            let items = [];
            $.each( formData.textTab, function( key, value ) {                                                                                               
                (key != "positionType") ? items.push({dataField: key}) : items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.TextPosition, value: ((value || value == 0) ? formData.TextPosition[value]?.value : ""), valueExpr: 'value', displayExpr: 'name'}})
            },),
            $('#text').dxForm({
              colCount: 5,
              formData: formData.textTab,
              items: items,
              labelLocation: "top",
              labelMode: 'floating',
              showColonAfterLabel: true,
              onFieldDataChanged: function (e) {
                that.getUpdatedPage();
            }
            });
        });

            let textarea = document.createElement("textarea");
            textarea.id = this.text_id;
            document.getElementById("text-editor-container-12").appendChild(textarea);
            setTimeout(() => {
                textarea.innerHTML = this.widget.text?.value ? this.widget.text.value : "";
                this.initHtmlEditors(this.text_id);
            }, 200)


        /* Events Tab */
        $(() => {
            let that = this;
            let items = [];
            $.each( formData.eventsTab, function( key, value ) {
                items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.Hover, value: ((value || value == 0) ? formData.Hover[value].value : ""), valueExpr: 'value', displayExpr: 'name'}});
            },),
            $('#events-checkbox').dxForm({
              colCount: 1, 
              formData: formData.eventsTab,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage();
            }
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
              colCount: 1,
              formData: formData.caType,
              items: items,
              labelLocation: "top",
            });
        });
        
        $(async () => {
            let that = this;
            // take all pages here (no homepages) for link action
            let pages = await new SaveManager().getPagesByType(1);
            let pagesSource = pages.map((page, index) => ({slug: page.slug, ID: index}));
            let pagesDataSource = new DevExpress.data.DataSource({
                store: {
                    type: 'array',
                    key: 'ID',
                    data: pagesSource,
                },
            });
            $("#ca-link").dxSelectBox({
                dataField: formData.link.url,
                dataSource: pagesDataSource,
                displayExpr: 'slug',
                valueExpr: 'slug',
                value: that.widget.clickAction?.url?.toString(),
                acceptCustomValue: true,
                onValueChanged: function (e) {
                    that.getUpdatedPage()
                },
                onCustomItemCreating(data) {
                    if (!data.text) {
                        data.customItem = null;
                        return;
                    }
                    const pageIds = pagesSource.map((page) => page.ID);
                    const incrementedId = Math.max.apply(null, pageIds) + 1;
                    const newItem = {
                        slug: data.text,
                        ID: incrementedId
                    };
                    data.customItem = pagesDataSource.store().insert(newItem)
                        .then(() => pagesDataSource.load())
                        .then(() => newItem)
                        .catch((error) => {
                            throw error;
                        });
                }
            })
        })
        
        $(() => {
            let items = [];
            $.each( formData.link, async function (key, value) {
                if (key == "url") {
                } else items.push({dataField: key, editorType: "dxCheckBox", value: value});
            },);
            $('#ca-0').dxForm({
              colCount: 1, 
              formData: formData.link,
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
              colCount: 1, 
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
            let that = this;
            $.each( formData.styleTab, function( key, value ) {
                if (key == "height" || key == "width")
                items.push({dataField: key});
            },),
            $('#dimensions').dxForm({
                colCount: 2, 
                formData: formData.styleTab,
                items: items,
                labelLocation: "top",
                onFieldDataChanged: function (e) {
                      that.getUpdatedPage();
                }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.margin, function( key, value ) {
                items.push({dataField: key});
            },),
            $('#margin').dxForm({
                colCount: 5,
                labelMode: 'floating',
                formData: formData.margin,
                items: items,
                showColonAfterLabel: true,
                labelLocation: "left",
                onFieldDataChanged: function (e) {
                    if (e.dataField == "total") {
                        formData.margin.top = null;
                        formData.margin.right = null;
                        formData.margin.bottom = null;
                        formData.margin.left = null;
                        this.updateData('top', formData.margin.top);
                        this.updateData('right', formData.margin.right);
                        this.updateData('bottom', formData.margin.bottom);
                        this.updateData('left', formData.margin.left);
                    }
                    that.getUpdatedPage()
                }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.padding, function( key, value ) {
                items.push({dataField: key});
            },),
            $('#padding').dxForm({
                colCount: 5,
                labelMode: 'floating',
                formData: formData.padding,
                items: items,
                showColonAfterLabel: true,
                labelLocation: "left",
                onFieldDataChanged: function (e) {
                    if (e.dataField == "total") {
                        formData.padding.top = null;
                        formData.padding.right = null;
                        formData.padding.bottom = null;
                        formData.padding.left = null;
                        this.updateData('top', formData.padding.top);
                        this.updateData('right', formData.padding.right);
                        this.updateData('bottom', formData.padding.bottom);
                        this.updateData('left', formData.padding.left);
                    }
                    that.getUpdatedPage()
                }
            });
        });
        $(() => {
            let items = [];
            let that = this;
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
                onFieldDataChanged: function (e) {
                  that.getUpdatedPage()
                }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.styleTab, function( key, value ) {
                if (key.indexOf("font") != -1)
                    items.push({dataField: key});
            },),
            $('#font').dxForm({
              colCount: 2, 
              formData: formData.styleTab,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each(formData.styleTab, function (key, value) {
                if (key.indexOf("border") != -1)
                    if (key == "borderStyle")                         
                        items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.Borders, placeholder: "solid", value: (value ? formData.Borders.find(b => b.value == value.toLowerCase()) : ""), valueExpr: 'value', displayExpr: 'value', onSelectionChanged(e) {that.getUpdatedPage()}}});
                    else if (key == "borderColor")
                        items.push({dataField: key, editorType: "dxColorBox"});
                    else 
                        items.push({ dataField: key });
            }),
                $('#border-properties').dxForm({
                    colCount: 3,
                    formData: formData.styleTab,
                    items: items,
                    labelLocation: "top",
                    onFieldDataChanged: function (e) {
                        that.getUpdatedPage()
                    }
                });
        });

        /* Mobile Style Tab */
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key == "height" || key == "width")
                items.push({dataField: key});
            },),
            $('#mobile-dimensions').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.mobileMargin, function( key, value ) {
                items.push({dataField: key});
            },),
            $('#mobile-margin').dxForm({
              colCount: 5, 
              formData: formData.mobileMargin,
              labelMode: 'floating',
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                if (e.dataField == "total") {
                    formData.mobileMargin.top = null;
                    formData.mobileMargin.right = null;
                    formData.mobileMargin.bottom = null;
                    formData.mobileMargin.left = null;
                    this.updateData('top', formData.mobileMargin.top);
                    this.updateData('right', formData.mobileMargin.right);
                    this.updateData('bottom', formData.mobileMargin.bottom);
                    this.updateData('left', formData.mobileMargin.left);
                }
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.mobilePadding, function( key, value ) {
                items.push({dataField: key});
            },),
            $('#mobile-padding').dxForm({
              colCount: 5, 
              formData: formData.mobilePadding,
              labelMode: 'floating',
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                if (e.dataField == "total") {
                    formData.mobilePadding.top = null;
                    formData.mobilePadding.right = null;
                    formData.mobilePadding.bottom = null;
                    formData.mobilePadding.left = null;
                    this.updateData('top', formData.mobilePadding.top);
                    this.updateData('right', formData.mobilePadding.right);
                    this.updateData('bottom', formData.mobilePadding.bottom);
                    this.updateData('left', formData.mobilePadding.left);
                }
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
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
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.mobileStyleTab, function( key, value ) {
                if (key.indexOf("font") != -1)
                    items.push({dataField: key});
            },),
            $('#mobile-font').dxForm({
              colCount: 2, 
              formData: formData.mobileStyleTab,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each(formData.mobileStyleTab, function (key, value) {
                if (key.indexOf("border") != -1)
                    if (key == "borderStyle")
                        items.push({dataField: key, editorType: 'dxSelectBox', editorOptions: {items: formData.Borders, placeholder: "solid", value: (value ? formData.Borders.find(b => b.value == value.toLowerCase()) : "solid"), valueExpr: 'value', displayExpr: 'value'}});
                    else if (key == "borderColor")
                        items.push({dataField: key, editorType: "dxColorBox"});
                    else
                        items.push({ dataField: key });
            }),
                $('#mobile-border-properties').dxForm({
                    colCount: 3,
                    formData: formData.mobileStyleTab,
                    items: items,
                    labelLocation: "top",
                    onFieldDataChanged: function (e) {
                        that.getUpdatedPage()
                    }
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

        var gallery;

        $(() => {
            let items = [];
            let that = this;
            $.each( formData.galleryConfiguration, function( key, value ) {
                if (key == "source") {
                    gallery = $('#gallery-source').dxDataGrid({
                      dataSource: formData.galleryConfiguration.source,
                      keyExpr: 'url',
                      editing: {
                        allowDeleting: true,
                      },
                      scrolling: {
                        mode: 'infinite',
                      },
                      sorting: {
                        mode: 'none',
                      },
                      onSaved() {
                          that.getUpdatedPage();
                      },
                      onRowRemoved() {
                          that.getUpdatedPage();
                      },
                      rowDragging: {
                        allowReordering: true,
                        onReorder(e) {
                          const visibleRows = e.component.getVisibleRows();
                          const toIndex = formData.galleryConfiguration.source.indexOf(visibleRows[e.toIndex].data);
                          const fromIndex = formData.galleryConfiguration.source.indexOf(e.itemData);
                          console.log(toIndex, fromIndex);
                  
                          formData.galleryConfiguration.source.splice(e.fromIndex, 1);
                          formData.galleryConfiguration.source.splice(e.toIndex, 0, e.itemData);
                  
                          e.component.refresh();

                          that.getUpdatedPage();
                        },
                      },
                      showBorders: true,
                      columns: [{
                        dataField: 'url',
                      },
                      {
                        dataField: 'thumbnail',
                        cellTemplate(container, options) {
                            $('<div>')
                              .append($('<img>', { src: options.value }).addClass("image-thumbnail"))
                              .appendTo(container);
                        },
                      }
                    ]
                    }).dxDataGrid('instance');
                }
            },)
        });
        $(() => {
            let that = this;
            $('#gallery-source-form').dxForm({
              colCount: 3,
              formData: formData.gallerySourceInput,
              items: [{
                    colSpan: 2,
                    dataField: 'url',
                    editorOptions: {
                        width: '100%'
                    }
                },
                {
                    itemType: 'button',
                    horizontalAlignment: 'right',
                    buttonOptions: {
                      text: 'Aggiungi',
                      type: 'normal',
                },}],
              labelLocation: "left",
              onFieldDataChanged: function (e) {
                if (that.imageExists(e.value) && e.value != "") {
                    let source = {
                        url: e.value,
                        thumbnail: e.value
                    };
                    formData.galleryConfiguration.source.push(source);
                    gallery.refresh();
                    this.resetValues();
                    that.getUpdatedPage();
                }
                else if (e.value) {
                    swal("Errore", "Sorgente non raggiungibile", "warning");
                    return;
                }
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.galleryConfiguration, function( key, value ) {
                if (key != "slideShowDelay" && key != "source")
                    items.push({dataField: key, editorType: "dxCheckBox", value: value});
                else if(key == "slideShowDelay") items.push({dataField: key});
            },),
            $('#gallery-content').dxForm({
              colCount: 1,
              formData: formData.galleryConfiguration,
              items: items,
              labelLocation: "left",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
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
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.videoConfiguration, function( key, value ) {
                if (key != "width" && key != "height" && key != "source")
                    items.push({dataField: key, editorType: "dxCheckBox", value: value});
                else if(key != "source") items.push({dataField: key});
            },),
            $('#video-content').dxForm({
              colCount: 1,
              formData: formData.videoConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.pdfConfiguration, function( key, value ) {
                items.push({dataField: key, editorType: "dxTextArea"});
            },),
            $('#pdf-source').dxForm({
              colCount: 1,
              formData: formData.pdfConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.showcaseConfiguration, function( key, value ) {
                if (key == "source")
                    items.push({dataField: key, editorType: "dxTextArea"});
            },),
            $('#showcase-source').dxForm({
              colCount: 1,
              formData: formData.showcaseConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.showcaseConfiguration, function( key, value ) {
                if (key != "source")
                    items.push({dataField: key});
            },),
            $('#showcase-content').dxForm({
              colCount: 1,
              formData: formData.showcaseConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.mapConfiguration, function( key, value ) {
                items.push({dataField: key, editorType: "dxTextArea"});
            },),
            $('#map-content').dxForm({
              colCount: 1,
              formData: formData.mapConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });
        $(() => {
            let items = [];
            let that = this;
            $.each( formData.webPageConfiguration, function( key, value ) {
                items.push({dataField: key, editorType: "dxTextArea"});
            },),
            $('#webpage-source').dxForm({
              colCount: 1,
              formData: formData.webPageConfiguration,
              items: items,
              labelLocation: "top",
              onFieldDataChanged: function (e) {
                that.getUpdatedPage()
            }
            });
        });



        var horizontalScrollGallery;

        $(() => {
            let that = this;
            $.each( formData.horizontalScrollGalleryConfiguration, function( key, value ) {
                if (key == "source") {
                    horizontalScrollGallery = $('#horizontalScrollGallery-source').dxDataGrid({
                      dataSource: formData.horizontalScrollGalleryConfiguration.source,
                      keyExpr: 'url',
                      editing: {
                        allowDeleting: true,
                      },
                      scrolling: {
                        mode: 'infinite',
                      },
                      sorting: {
                        mode: 'none',
                      },
                      onSaved() {
                          that.getUpdatedPage();
                      },
                      onRowRemoved() {
                          that.getUpdatedPage();
                      },
                      rowDragging: {
                        allowReordering: true,
                        onReorder(e) {
                          const visibleRows = e.component.getVisibleRows();
                          const toIndex = formData.horizontalScrollGalleryConfiguration.source.indexOf(visibleRows[e.toIndex].data);
                          const fromIndex = formData.horizontalScrollGalleryConfiguration.source.indexOf(e.itemData);
                          console.log(toIndex, fromIndex);
                  
                          formData.horizontalScrollGalleryConfiguration.source.splice(e.fromIndex, 1);
                          formData.horizontalScrollGalleryConfiguration.source.splice(e.toIndex, 0, e.itemData);
                  
                          e.component.refresh();

                          that.getUpdatedPage();
                        },
                      },
                      showBorders: true,
                      columns: [{
                        dataField: 'url',
                      },
                      {
                        dataField: 'thumbnail',
                        cellTemplate(container, options) {
                            $('<div>')
                              .append($('<img>', { src: options.value }).addClass("image-thumbnail"))
                              .appendTo(container);
                        },
                      }
                    ]
                    }).dxDataGrid('instance');
                }
            },)
        });
        $(() => {
            let that = this;
            $('#horizontal-gallery-source-form').dxForm({
              colCount: 2,
              formData: formData.horizontalScrollGallerySourceInput,
              items: [{
                    dataField: 'url',
                    editorOptions: {
                        width: '100%'
                    }
                },
                {
                    itemType: 'button',
                    horizontalAlignment: 'right',
                    editorOptions: {
                        width: '10%'
                    },
                    buttonOptions: {
                      text: 'Aggiungi',
                      type: 'normal',
                      useSubmitBehavior: true,
                },}],
              labelLocation: "left",
              onFieldDataChanged: function (e) {
                if (that.imageExists(e.value) && e.value != "") {
                    let source = {
                        url: e.value,
                        thumbnail: e.value
                    };
                    formData.horizontalScrollGalleryConfiguration.source.push(source);
                    horizontalScrollGallery.refresh();
                    this.resetValues();
                    that.getUpdatedPage()
                }
                else if (e.value)
                    swal("Errore", "Immagine non raggiungibile", "warning");
            }
            });
        });


        var gridGallery;

        $(() => {
            let that = this;
            $.each( formData.horizontalScrollGalleryConfiguration, function( key, value ) {
                if (key == "source") {
                    gridGallery = $('#gridGallery-source').dxDataGrid({
                      dataSource: formData.gridGalleryConfiguration.source,
                      keyExpr: 'url',
                      editing: {
                        allowDeleting: true,
                      },
                      scrolling: {
                        mode: 'virtual',
                      },
                      sorting: {
                        mode: 'none',
                      },
                      onSaved() {
                          that.getUpdatedPage();
                      },
                      onRowRemoved() {
                          that.getUpdatedPage();
                      },
                      rowDragging: {
                        allowReordering: true,
                        onReorder(e) {
                          const visibleRows = e.component.getVisibleRows();
                          const toIndex = formData.gridGalleryConfiguration.source.indexOf(visibleRows[e.toIndex].data);
                          const fromIndex = formData.gridGalleryConfiguration.source.indexOf(e.itemData);                  
                          formData.gridGalleryConfiguration.source.splice(e.fromIndex, 1);
                          formData.gridGalleryConfiguration.source.splice(e.toIndex, 0, e.itemData);
                          e.component.refresh();
                          that.getUpdatedPage();
                        },
                      },
                      showBorders: true,
                      columns: [{
                        dataField: 'url',
                      },
                      {
                        dataField: 'thumbnail',
                        cellTemplate(container, options) {
                            $('<div>')
                              .append($('<img>', { src: options.value }).addClass("image-thumbnail"))
                              .appendTo(container);
                        },
                      }
                    ]
                    }).dxDataGrid('instance');
                }
            },)
        });
        $(() => {
            let that = this;
            $('#grid-gallery-source-form').dxForm({
              colCount: 2,
              formData: formData.gridGallerySourceInput,
              items: [{
                    dataField: 'url',
                    editorOptions: {
                        width: '100%'
                    }
                },
                {
                    itemType: 'button',
                    horizontalAlignment: 'right',
                    editorOptions: {
                        width: '10%'
                    },
                    buttonOptions: {
                      text: 'Aggiungi',
                      type: 'normal',
                      useSubmitBehavior: true,
                },}],
              labelLocation: "left",
              onFieldDataChanged: function (e) {
                if (that.imageExists(e.value) && e.value != "") {
                    let source = {
                        url: e.value,
                        thumbnail: e.value
                    };
                    formData.gridGalleryConfiguration.source.push(source);
                    gridGallery.refresh();
                    this.resetValues();
                    that.getUpdatedPage()
                }
                else if (e.value)
                    swal("Errore", "Immagine non raggiungibile", "warning");
            }
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
                    that.getUpdatedPage();
                } else if (e.removedItems.length > 0) {
                    that.borders = that.borders.filter(border => border != e.removedItems[0].style);
                    $("#border-selection").dxButtonGroup({ 
                        selectedItemKeys: that.borders
                    });
                    that.getUpdatedPage();
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
        if (type == 0)
            document.getElementById('ca-link').style.display = "block";
        else document.getElementById('ca-link').style.display = "none";
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

    imageExists(image_url){

        var http = new XMLHttpRequest();
    
        http.open('HEAD', image_url, false);
        //http.send();
    
        return true;
    
    }

    isWidgetValid(updatedWidget) {
        if (updatedWidget.row == null || updatedWidget.column == null || updatedWidget.type == null || !updatedWidget.content)
            return false;
        switch (updatedWidget.type) {
            case 0:
                if (!updatedWidget.content.text)
                    return false;
                return true
                break;

            case 1:
            case 2:
            case 3:
            case 101:
            case 102:
                if (!updatedWidget.content.source || updatedWidget.content.source == "")
                    return false;
                return true
                break;

            case 4:
                if (!updatedWidget.content.source || updatedWidget.content.showCaseId == null)
                    return false;
                return true
                break;

            case 5:
                if (updatedWidget.content.latitude == null || updatedWidget.content.longitude == null)
                    return false;
                return true
                break;
        
            default:
                break;
        }
    }

    deleteWidget(widget) {
        Swal.fire({
            title: 'Eliminare il widget ?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("sidebar-edit-view").style.display = "none";
                document.getElementById("sidebar-default-view").style.display = "block";
                this.selectedPage.contents.widgets.forEach(currWidget => {
                    if (currWidget.row == widget.row && currWidget.column == widget.column) {
                        currWidget.type = 1000;
                        currWidget.content = {};
                    }
                });
                this.renderer.selectedPage = this.selectedPage;
                let totRows = this.renderer.calculateRows(this.selectedPage.contents.widgets);
                let totCols = this.renderer.calculateColumns(this.selectedPage.contents.widgets);
                this.renderer.initFallbackRespondiveBox(totRows, totCols, false);
                // replace the entire row taking from fallback responsivebox
                let responsiveBoxCotnainer = document.getElementById('responsive-box'),
                    newRowDiv = document.getElementById('fallback-responsive-box').children[0].children[widget.row],
                    oldRowDiv = responsiveBoxCotnainer.children[0].children[widget.row];
                console.log(newRowDiv)
                responsiveBoxCotnainer.children[0].replaceChild(newRowDiv, oldRowDiv);
                // update main responsivebox screenItems
                this.renderer.responsiveBox._screenItems = this.renderer.responsiveBox._screenItems.filter(screenItem => screenItem.location.row != widget.row);
                this.renderer.fallbackResponsiveBox._screenItems.forEach(screenItem => {
                    if (screenItem.location.row == widget.row) {
                        console.log(screenItem)
                        this.renderer.responsiveBox._screenItems.push(screenItem);
                    }
                });
                // reset fallback responsivebox screenItems
                this.renderer.fallbackResponsiveBox._screenItems = null;
                console.log(this.selectedPage.contents.widgets)
                this.renderer.historyManager.updateHistory(this.selectedPage);
            }
        });
    }

    // to adapt page layout after widget has been deleted
    adaptPageLayout(deletedWidget) {
        let isColumnEmpty = true;
        this.selectedPage.contents.widgets.forEach(w => {
            if (w.column == deletedWidget.column || (w.column < deletedWidget.column  && (w.column + w.columnSpan) >= deletedWidget.column))
            isColumnEmpty = false;
        });
        // if (isColumnEmpty) {
        //     this.selectedPage.contents.widgets.forEach(w => {
        //             w.column -= deletedWidget.column ? (deletedWidget.column + deletedWidget.columnSpan) : (1 + deletedWidget.columnSpan);
        //     })
        // }
        let isRowEmpty = true;
        this.selectedPage.contents.widgets.forEach(w => {
            if (w.row == deletedWidget.row || (w.row < deletedWidget.row && (w.row + w.rowSpan) >= deletedWidget.row))
                isRowEmpty = false;
        })
        if (isRowEmpty)
            this.selectedPage.contents.widgets.forEach(w => { if (w.row  > deletedWidget.row) w.row-- });
    }

    getUpdatedPage() {
        let initialWidget = this.widget;
        let formData = JSON.parse(JSON.stringify(this.newFormData))
        let url = $("#ca-link").dxSelectBox('instance').option('value');
        let widget = new Widget(formData, this.text_content_id, this.text_id, this.borders, this.mobileBorders, this.groupValueIds, url);
        let modifiedWidget = widget.widgetBinding();
        let saveManager = new SaveManager(modifiedWidget, initialWidget, this.selectedPage, this.newFormData.metadataTab);
        let updatedPage = saveManager.updatePage();
        if (updatedPage) {
            this.renderer.saveInDraftBtn.option("disabled", false);
            // this.renderer.historyManager.updateHistory(JSON.parse(JSON.stringify(modifiedWidget)));
            this.renderer.renderWidgetChanges(JSON.parse(JSON.stringify(modifiedWidget)), updatedPage);
        }
    }

}
