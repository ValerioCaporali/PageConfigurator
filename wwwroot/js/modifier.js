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
        });
    }

    restHtmlEditors() {
        if (tinymce.get("0-text")) tinymce.get("0-text").setContent("");
        if (tinymce.get("value")) tinymce.get("value").setContent("");
    }

    initPanel(widget) {
        this.resetPanel();
        this.restHtmlEditors();
        this.resetBordersButton();
        this.initCommonSettingsPanel(widget);
        document.getElementById("modify-modal-title").innerHTML = this.widgetIndex[widget.type];
        document.getElementById(widget.type).style.display = "block";
        for (const [key, value] of Object.entries(widget.content)) {
            if (key.toString() == "text" && value) {
                this.initHtmlEditors("0-text");
                tinymce.get("0-text").setContent(value);
            }
            if (
                document.getElementById(
                    widget.type.toString() + "-" + key.toString()
                ) &&
                value
            ) {
                if (value == true || value == false) {
                    document.getElementById(
                        widget.type.toString() + "-" + key.toString()
                    ).checked = value;
                }
                document.getElementById(
                    widget.type.toString() + "-" + key.toString()
                ).value = value;
            }
        }
    }

    initCommonSettingsPanel(widget) {
        this.initBordersButton();
        for (const [key, value] of Object.entries(widget)) {
            switch (key) {
                case "text":
                    this.initHtmlEditors("value");
                    if (value) {
                        for (const [key, value] of Object.entries(widget.text)) {
                            if (key == "position" && value) {
                                for   (const [position_key, positoin_value] of Object.entries(value)) {
                                    if (position_key == "type" && positoin_value == 1)
                                        document.getElementById("text-position-wrapper").style.display = "block";
                                    document.getElementById(position_key).value = positoin_value;
                                }
                            } else {
                                tinymce.get(key).setContent(value.toString());
                            }
                        }
                    }
                    break;
                case "style":
                    if (widget.style) {
                        for (const [key, value] of Object.entries(widget.style)) {
                            if (key == "margin" && widget.style.margin) {
                                for (const [key, value] of Object.entries(widget.style.margin)) {
                                    if (key == "total" && value) {
                                        document.getElementById("m-top").value = value;
                                        document.getElementById("m-right").value = value;
                                        document.getElementById("m-bottom").value = value;
                                        document.getElementById("m-left").value = value;
                                    }
                                    if (key != "total" && value) {
                                        document.getElementById("m-" + key.toString()).value = value;
                                    }
                                }
                            }
                            if (key == "padding" && widget.style.padding) {
                                for (const [key, value] of Object.entries(widget.style.padding)) {
                                    if (key == "total" && value) {
                                        document.getElementById("p-top").value = value;
                                        document.getElementById("p-right").value = value;
                                        document.getElementById("p-bottom").value = value;
                                        document.getElementById("p-left").value = value;
                                    }
                                    if (key != "total" && value) {
                                        document.getElementById("p-" + key).value = value;
                                    }
                                }
                            }

                            if (key == "borders" && widget.style.borders) {
                                for (let i = 0; i < widget.style.borders.length; i++) {
                                    for (const [key, value] of Object.entries(widget.style.borders[i])) {
                                        console.log(key, value);
                                        if (key == "type" && value == 1 && value) {
                                            $("#border-selection").dxButtonGroup({
                                                selectedItemKeys: ['arrowleft']
                                            });
                                        } else if (key == "type" && value == 2 && value) {
                                            $("#border-selection").dxButtonGroup({
                                                selectedItemKeys: ['arrowright']
                                            });
                                        } else if (key == "type" && value == 3 && value) {
                                            $("#border-selection").dxButtonGroup({
                                                selectedItemKeys: ['arrowtop']
                                            });
                                        } else if (key == "type" && value == 4 && value) {
                                            $("#border-selection").dxButtonGroup({
                                                selectedItemKeys: ['arrowbottom']
                                            });
                                        } else if (value) {
                                            document.getElementById('border-' + key).value = value;
                                        }
                                    }
                                }
                            }

                            if (key != "margin" && key != "padding" && key != "borders" && value) {
                                console.log(key, document.getElementById(key));
                                document.getElementById(key).value = value;
                            }
                        }
                    }
                    break;

                case "mobileStyle":
                    if (widget.mobileStyle) {
                        for (const [key, value] of Object.entries(widget.mobileStyle)) {
                            if (key == "margin" && widget.mobileStyle.margin) {
                                for (const [key, value] of Object.entries(widget.mobileStyle.margin)) {
                                    if (key == "total" && value) {
                                        document.getElementById("mobile-m-top").value = value;
                                        document.getElementById("mobile-m-right").value = value;
                                        document.getElementById("mobile-m-bottom").value = value;
                                        document.getElementById("mobile-m-left").value = value;
                                    }
                                    if (key != "total" && value) {
                                        document.getElementById("mobile-m-" + key).value = value;
                                    }
                                }
                            }
                            if (key == "padding" && widget.mobileStyle.padding) {
                                for (const [key, value] of Object.entries(widget.mobileStyle.padding)) {
                                    if (key == "total" && value) {
                                        document.getElementById("mobile-p-top").value = value;
                                        document.getElementById("mobile-p-right").value = value;
                                        document.getElementById("mobile-p-bottom").value = value;
                                        document.getElementById("mobile-p-left").value = value;
                                    }
                                    if (key != "total" && value) {
                                        document.getElementById("mobile-p-" + key).value = value;
                                    }
                                }
                            }
                            if (key != "margin" && key != "padding" && key != "borders" && value) {
                                document.getElementById(key).value = value;
                            }
                        }
                    }
                    break;

                case "clickAction":
                    console.log("init click action");
                    break;

                default:
                    if (key != "content" && key != "clickAction") {
                        if (document.getElementById(key)) {
                            document.getElementById(key).value = value;
                        }
                    }
                    break;
            }
        }
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
    }

    saveWidget() {
        // salvataggio del widget (in locale)
    }
}
