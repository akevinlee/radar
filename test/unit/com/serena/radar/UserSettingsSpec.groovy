package com.serena.radar

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(UserSettings)
class UserSettingsSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    void testCreate() {
        UserSettings s = new UserSettings()
        assert s.validate()
    }
}
