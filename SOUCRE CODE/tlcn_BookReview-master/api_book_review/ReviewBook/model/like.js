class Like {
  constructor(imageUser, nameUser) {
    this.numberTime = Date.now(),
      this.imageUser = imageUser,
      this.nameUser = nameUser
  }
}

module.exports = Like;