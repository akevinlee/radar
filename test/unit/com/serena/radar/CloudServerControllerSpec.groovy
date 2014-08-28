package com.serena.radar


import grails.test.mixin.*
import spock.lang.*

@TestFor(CloudServerController)
@Mock(CloudServer)
class CloudServerControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
    }

    void "Test the index action returns the correct model"() {

        when: "The index action is executed"
        controller.index()

        then: "The model is correct"
        !model.cloudServerInstanceList
        model.cloudServerInstanceCount == 0
    }

    void "Test the create action returns the correct model"() {
        when: "The create action is executed"
        controller.create()

        then: "The model is correctly created"
        model.cloudServerInstance != null
    }

    void "Test the save action correctly persists an instance"() {

        when: "The save action is executed with an invalid instance"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'POST'
        def cloudServer = new CloudServer()
        cloudServer.validate()
        controller.save(cloudServer)

        then: "The create view is rendered again with the correct model"
        model.cloudServerInstance != null
        view == 'create'

        when: "The save action is executed with a valid instance"
        response.reset()
        populateValidParams(params)
        cloudServer = new CloudServer(params)

        controller.save(cloudServer)

        then: "A redirect is issued to the show action"
        response.redirectedUrl == '/cloudServer/show/1'
        controller.flash.message != null
        CloudServer.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when: "The show action is executed with a null domain"
        controller.show(null)

        then: "A 404 error is returned"
        response.status == 404

        when: "A domain instance is passed to the show action"
        populateValidParams(params)
        def cloudServer = new CloudServer(params)
        controller.show(cloudServer)

        then: "A model is populated containing the domain instance"
        model.cloudServerInstance == cloudServer
    }

    void "Test that the edit action returns the correct model"() {
        when: "The edit action is executed with a null domain"
        controller.edit(null)

        then: "A 404 error is returned"
        response.status == 404

        when: "A domain instance is passed to the edit action"
        populateValidParams(params)
        def cloudServer = new CloudServer(params)
        controller.edit(cloudServer)

        then: "A model is populated containing the domain instance"
        model.cloudServerInstance == cloudServer
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when: "Update is called for a domain instance that doesn't exist"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'PUT'
        controller.update(null)

        then: "A 404 error is returned"
        response.redirectedUrl == '/cloudServer/index'
        flash.message != null


        when: "An invalid domain instance is passed to the update action"
        response.reset()
        def cloudServer = new CloudServer()
        cloudServer.validate()
        controller.update(cloudServer)

        then: "The edit view is rendered again with the invalid instance"
        view == 'edit'
        model.cloudServerInstance == cloudServer

        when: "A valid domain instance is passed to the update action"
        response.reset()
        populateValidParams(params)
        cloudServer = new CloudServer(params).save(flush: true)
        controller.update(cloudServer)

        then: "A redirect is issues to the show action"
        response.redirectedUrl == "/cloudServer/show/$cloudServer.id"
        flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when: "The delete action is called for a null instance"
        request.contentType = FORM_CONTENT_TYPE
        request.method = 'DELETE'
        controller.delete(null)

        then: "A 404 is returned"
        response.redirectedUrl == '/cloudServer/index'
        flash.message != null

        when: "A domain instance is created"
        response.reset()
        populateValidParams(params)
        def cloudServer = new CloudServer(params).save(flush: true)

        then: "It exists"
        CloudServer.count() == 1

        when: "The domain instance is passed to the delete action"
        controller.delete(cloudServer)

        then: "The instance is deleted"
        CloudServer.count() == 0
        response.redirectedUrl == '/cloudServer/index'
        flash.message != null
    }
}
