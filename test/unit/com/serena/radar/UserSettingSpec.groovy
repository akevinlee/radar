package com.serena.radar

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(UserSetting)
class UserSettingSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    void testCreate() {
        UserSetting s = new UserSetting()
        assert s.validate()
    }
}
