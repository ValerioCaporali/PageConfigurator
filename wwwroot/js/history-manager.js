export default class HistoryManager {

    history = [];
    current_index;
    
    constructor() {}

    getHistory() {

        return this.history;

    }

    updateHistory(page) {
        
        document.getElementById("prev-page").style.display = "block";

        this.history.push(page);
        if (this.history.length != 0)
            this.current_index = this.history.length - 1;
        
        console.log("history on update ", this.history);

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
            console.log("history lenght ", this.history.length)
            return this.history[0];
        }
        else {
            this.history.splice(this.current_index);
            console.log("history lenght ", this.history.length)
            this.current_index--;
            return this.history[this.current_index];
        }
        
    }

    isHistoryEmpty() {

        return this.history.length == 0;

    }

}