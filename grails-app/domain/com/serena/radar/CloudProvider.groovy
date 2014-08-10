package com.serena.radar

class CloudProvider {

    static constraints = {
        name(blank: false, unique: true)
    }

    String name
    String description
    static hasMany = [connector:CloudConnector]
}
