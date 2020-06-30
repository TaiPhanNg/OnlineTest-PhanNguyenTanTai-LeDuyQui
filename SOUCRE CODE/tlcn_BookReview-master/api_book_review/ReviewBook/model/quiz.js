class Quiz{
    constructor(
        kind,
        dateStart,
        active,
        role
        
    ){
        this.kind = kind,
        this.dateCreate = new Date().toLocaleString("vi", {
            hour: "numeric",
            minute: "numeric",
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric"
        }),
        this.dateStart = dateStart,
        this.active =active,
        this.role =role
        this.question =new Array();
        this.numberTime = Date.now();
    }
}
module.exports = Quiz;