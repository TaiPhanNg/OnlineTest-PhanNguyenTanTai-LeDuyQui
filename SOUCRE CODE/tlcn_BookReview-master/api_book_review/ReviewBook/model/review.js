class Review{
    constructor(
        kind,
        urlImage,
        nameImage,
        desc,
        uid,
        name,
        urlUser
    ){
        this.kind = kind,
        this.urlImage = urlImage,
        this.nameImage = nameImage,
        this.desc = desc,
        this.uid = uid,
        this.name = name,
        this.urlUser = urlUser,
        this.likes = new Array();
        this.comments = new Array();
        this.shares = new Array();
        this.numberTime = Date.now();
        this.time = new Date().toLocaleString("vi", {
            hour: "numeric",
            minute: "numeric",
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric"
        })
    }

    
}

module.exports = Review;