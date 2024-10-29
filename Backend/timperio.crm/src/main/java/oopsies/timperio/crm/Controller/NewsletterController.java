// NewsletterController.java
package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import oopsies.timperio.crm.Service.NewsletterService;
import oopsies.timperio.crm.dto.NewsletterDTO;
import oopsies.timperio.crm.Newsletter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping("/save")
    public ResponseEntity<String> saveNewsletter(@RequestBody Newsletter newsletter, HttpSession session) {
        // Attempt to save the newsletter and its products
        try {
            newsletterService.saveNewsletter(newsletter, session);
            return ResponseEntity.status(HttpStatus.CREATED).body("Newsletter saved successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving template: " + e.getMessage());
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<NewsletterDTO>> getNewslettersByAccountId(@PathVariable String accountId) {
        try {
            List<NewsletterDTO> newsletters = newsletterService.getNewslettersByAccountId(accountId);
            return ResponseEntity.ok(newsletters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}