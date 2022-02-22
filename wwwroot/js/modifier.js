import GalleryWidget from '../js/configurations/gallery-configuration.js';
import ShowcaseWidget from '../js/configurations/showcase-configuration.js';
import MapWidget from '../js/configurations/map-configuration.js';
import TextWidget from '../js/configurations/text-configuration.js';
import VideoWidget from '../js/configurations/video-configuration.js';
export default class Modifier {

    widgetIndex = {
        0: 'Testo',
        1: 'Galleria',
        2: 'Video',
        3: 'Pdf',
        4: 'Tour',
        5: 'Mappa',
        6: 'Pagina web',
        101: 'Galleria orizzontale',
        102: 'Galleria a griglia'
    }

    widget;
    constructor(widget) {
        this.widget = widget;
        this.initPanel(this.widget);
        document.getElementById('save-widget-changes-button').addEventListener('click', () => { this.saveWidget(this.widget) });
    }

    initPanel = (widget) => {
        console.log(widget);
        this.resetPanel();
        this.initCommonSettingsPanel(widget);
        document.getElementById('modify-modal-title').innerHTML = this.widgetIndex[widget.type];
        document.getElementById(widget.type).style.display = "block";
        for (const [key, value] of Object.entries(widget.content)) {
            if (document.getElementById(widget.type.toString() + "-" + key.toString()) && value) {
                if (value == true || value == false) {
                    document.getElementById(widget.type.toString() + "-" + key.toString()).checked = value;
                }
                document.getElementById(widget.type.toString() + "-" + key.toString()).value = value;
            }

        }
    }

    initCommonSettingsPanel = (widget) => {
        document.getElementById('widget-type').value = widget.type;
        if (widget.id) document.getElementById('widget-id').value = widget.id;
    }

    resetPanel = () => {
        for (const [key, value] of Object.entries(this.widgetIndex)) {
            document.getElementById(key.toString()).style.display = "none";
        }
    }

    saveWidget = () => {
        // salvataggio del widget (in locale)
    }


}