package com.serena.radar

class DashboardController {

    def view() {
        render(view: "view", model: [fullscreen: params.fullscreen])
    }


}

