// NewsletterController.java
package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import oopsies.timperio.crm.Service.NewsletterService;
import oopsies.timperio.crm.Newsletter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    private static final Logger logger = LoggerFactory.getLogger(NewsletterController.class);

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping("/save")
    public ResponseEntity<String> saveNewsletter(@RequestBody Newsletter newsletter, HttpSession session) {
        // Attempt to save the newsletter and its products
        try {
            newsletterService.saveNewsletter(newsletter, session);
            return ResponseEntity.status(HttpStatus.CREATED).body("Newsletter saved successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Unauthorized error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error saving newsletter: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving template: " + e.getMessage());
        }
    }

}