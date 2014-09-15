package com.serena.radar

// proxy User class for SDA
class User {

    String login
    String password
    String name
    String email

    String toString() {
        name + " (" + login +")"
    }

    def isAttached()
    {
        return false
    }
}
