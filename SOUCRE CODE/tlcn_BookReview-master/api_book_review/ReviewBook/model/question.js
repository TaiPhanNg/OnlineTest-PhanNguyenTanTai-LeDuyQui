class Question{
    constructor(
        cont,
        part,
        option,
        image,
        urlImage,
        audio,
        urlAudio
    ){
        this.cont = cont,
        this.part = part,
        this.option =option,
        this.image = image,
        this.urlImage = urlImage,
        this.audio = audio,
        this.urlAudio = urlAudio,
        this.quiz =new Array()
        this.numberTime = Date.now();
        this.dateCreate = new Date().toLocaleString("vi", {
            hour: "numeric",
            minute: "numeric",
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric"
        })
    }
}
module.exports = Question;