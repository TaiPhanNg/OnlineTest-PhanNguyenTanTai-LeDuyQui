class User{
    constructor(
        firstName,
        secondName,
        gender,
        phone,
        birthday,
        email
    ){
        this.firstName = firstName,
        this.secondName = secondName,
        this.gender = gender,
        this.phone = phone,
        this.birthday = new Date(birthday).toLocaleDateString('vi');
        this.email = email,
        this.image = new String(),
        this.lock = false
        this.premier =false
    }
}
module.exports = User;