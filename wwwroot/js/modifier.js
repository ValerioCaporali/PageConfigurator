export default class Modifier {

    widget;
    constructor(widget) {
        this.widget = widget;
        this.modifyWidget();
    }

    modifyWidget = () => {
        console.log(this.widget);
    }
}