package com.serena.radar


import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class CloudConnectorController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond CloudConnector.list(params), model: [cloudConnectorInstanceCount: CloudConnector.count()]
    }

    def show(CloudConnector cloudConnectorInstance) {
        respond cloudConnectorInstance
    }

    def create() {
        respond new CloudConnector(params)
    }

    @Transactional
    def save(CloudConnector cloudConnectorInstance) {
        if (cloudConnectorInstance == null) {
            notFound()
            return
        }

        if (cloudConnectorInstance.hasErrors()) {
            respond cloudConnectorInstance.errors, view: 'create'
            return
        }

        cloudConnectorInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'cloudConnector.label', default: 'CloudConnector'), cloudConnectorInstance.id])
                redirect cloudConnectorInstance
            }
            '*' { respond cloudConnectorInstance, [status: CREATED] }
        }
    }

    def edit(CloudConnector cloudConnectorInstance) {
        respond cloudConnectorInstance
    }

    @Transactional
    def update(CloudConnector cloudConnectorInstance) {
        if (cloudConnectorInstance == null) {
            notFound()
            return
        }

        if (cloudConnectorInstance.hasErrors()) {
            respond cloudConnectorInstance.errors, view: 'edit'
            return
        }

        cloudConnectorInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'CloudConnector.label', default: 'CloudConnector'), cloudConnectorInstance.id])
                redirect cloudConnectorInstance
            }
            '*' { respond cloudConnectorInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(CloudConnector cloudConnectorInstance) {

        if (cloudConnectorInstance == null) {
            notFound()
            return
        }

        cloudConnectorInstance.delete flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'CloudConnector.label', default: 'CloudConnector'), cloudConnectorInstance.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'cloudConnector.label', default: 'CloudConnector'), params.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }
}
