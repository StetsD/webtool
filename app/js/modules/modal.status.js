module.exports = class modalStatus {
    constructor(options){
        this.$elem = options.$elem;
        this.$elemStatus = options.$elem.find('.header');
    }

    show(){
        this.$elem.modal('show');
    }

    addStatus(msg){
        this.$elemStatus.text(msg);
    }
}
