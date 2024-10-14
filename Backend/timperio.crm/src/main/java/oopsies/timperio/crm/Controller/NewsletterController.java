package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import oopsies.timperio.crm.Service.NewsletterService;
import oopsies.timperio.crm.Newsletter;

@RestController
@RequestMapping("/api/v1/newsletter")
@CrossOrigin(origins = "*")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping
    public ResponseEntity<String> saveNewsletter(@RequestBody Newsletter newsletter) {
        try {
            newsletterService.saveNewsletter(newsletter);
            return ResponseEntity.ok("Newsletter saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving newsletter: " + e.getMessage());
        }
    }
}
