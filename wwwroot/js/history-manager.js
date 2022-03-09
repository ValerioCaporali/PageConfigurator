export default class HistoryManager {

    history = [];
    current_index;
    
    constructor() {}

    getHistory() {

        return this.history;

    }

    updateHistory(page) {
        
        document.getElementById("prev-page").style.display = "block";

        if (this.current_index > 0 && this.current_index < (this.history.length - 1)) {
            this.history = this.history.splice(0, this.current_index);
        }

        this.history.push(page);
        if (this.history.length != 0)
            this.current_index = this.history.length - 1;

    }

    getLastPage() {

        return this.history[this.history.length - 1];

    }

    getPreviousPage() {

        if ((this.current_index) == 1) {
            document.getElementById("prev-page").style.display = "none";
            return this.history[0];
        }
        else {
            this.current_index--;
            return this.history[this.current_index];
        }

    }

    isHistoryEmpty() {

        return this.history.length == 0;

    }

}