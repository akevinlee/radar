package com.serena.radar

class CloudConnector {

    static constraints = {
        name(blank: false, unique: true)
    }

    String name
    String description

    CloudProvider provider

    String procCreateId
    String procDeleteId
    String procStartId
    String procStopId

}
