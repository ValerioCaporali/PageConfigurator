export default class HistoryManager {

    history = [];
    current_index;
    maxHistoryLenght = 10;
    
    constructor() {}

    getHistory() {
        return this.history;
    }

    updateHistory(page) {
        if (this.getHistoryLenght() > 0)
            document.getElementById("prev-page").style.display = "block";
        this.history.push(page);
        console.log(this.history);
        if (this.history.length != 0) {
            // if (this.history.length > this.maxHistoryLenght)
            //     this.history.shift();
            this.current_index = this.history.length - 1;
        }
    }

    emptyHistory() {
        this.history = [];
    }

    getInitialPage() {
        return this.history[0];
    }

    getLastPage() {
        return this.history[this.history.length - 1];
    }

    getPreviousPage() {
        if ((this.current_index) == 1) {
            document.getElementById("prev-page").style.display = "none";
            this.history.splice(this.current_index);
            this.current_index = 0;
            return this.history[0];
        } else if (this.current_index == 0) {
            return this.history[this.current_index];
        } else {
            this.history.splice(this.current_index);
            this.current_index--;
            return this.history[this.current_index];
        }
    }

    getHistoryLenght() {
        return this.history.length;
    }

    isHistoryEmpty() {
        return this.history.length == 0;
    }

}