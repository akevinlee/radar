package com.serena.radar


import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class CloudProviderController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond CloudProvider.list(params), model: [cloudProviderInstanceCount: CloudProvider.count()]
    }

    def show(CloudProvider cloudProviderInstance) {
        respond cloudProviderInstance
    }

    def create() {
        respond new CloudProvider(params)
    }

    @Transactional
    def save(CloudProvider cloudProviderInstance) {
        if (cloudProviderInstance == null) {
            notFound()
            return
        }

        if (cloudProviderInstance.hasErrors()) {
            respond cloudProviderInstance.errors, view: 'create'
            return
        }

        cloudProviderInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'cloudProvider.label', default: 'CloudProvider'), cloudProviderInstance.id])
                redirect cloudProviderInstance
            }
            '*' { respond cloudProviderInstance, [status: CREATED] }
        }
    }

    def edit(CloudProvider cloudProviderInstance) {
        respond cloudProviderInstance
    }

    @Transactional
    def update(CloudProvider cloudProviderInstance) {
        if (cloudProviderInstance == null) {
            notFound()
            return
        }

        if (cloudProviderInstance.hasErrors()) {
            respond cloudProviderInstance.errors, view: 'edit'
            return
        }

        cloudProviderInstance.save flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'CloudProvider.label', default: 'CloudProvider'), cloudProviderInstance.id])
                redirect cloudProviderInstance
            }
            '*' { respond cloudProviderInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(CloudProvider cloudProviderInstance) {

        if (cloudProviderInstance == null) {
            notFound()
            return
        }

        cloudProviderInstance.delete flush: true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'CloudProvider.label', default: 'CloudProvider'), cloudProviderInstance.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'cloudProvider.label', default: 'CloudProvider'), params.id])
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }
}
