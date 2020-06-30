class Chat{
    constructor(
        id_user,
        body,
        imageUser,
        nameUser){
            this.id_user = id_user,
            this.body = body,
            this.imageUser = imageUser,
            this.nameUser = nameUser,
            this.numberTime = Date.now(),
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

module.exports = Chat;