package com.serena.radar

class User {

    static constraints = {
        login(unique: true)
        password()
        name()
        email()
    }

    String login
    String password
    String name
    String email

    String toString() {
        name + " (" + login +")"
    }
}
