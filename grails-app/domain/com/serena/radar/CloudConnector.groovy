package com.serena.radar

class CloudConnector {

    static constraints = {
        name(blank: false, unique: true)
    }

    String name
    static hasOne = [provider:CloudProvider]
}
