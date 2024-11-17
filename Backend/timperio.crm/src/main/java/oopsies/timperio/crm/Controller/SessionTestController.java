package oopsies.timperio.crm.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class SessionTestController {

    @GetMapping("/test-session")
    public String testSession(HttpSession session) {
        session.setAttribute("testAttribute", "testValue");
        return "Session attribute set!";
    }
    
}
