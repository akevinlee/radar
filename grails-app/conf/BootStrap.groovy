import com.serena.radar.UserSettingController

import javax.servlet.ServletContext

class BootStrap {

    def init = { ServletContext ctx ->
        environments {
            production {
                ctx.setAttribute("env", "prod")
            }
            development {
                ctx.setAttribute("env", "dev")
            }
        }
    }

    def destroy = {
    }
}
