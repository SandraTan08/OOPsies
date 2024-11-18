package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import oopsies.timperio.crm.Service.NewsletterService;
import oopsies.timperio.crm.dto.NewsletterDTO;
import oopsies.timperio.crm.Newsletter;

import java.util.List;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping("/create")
    public ResponseEntity<Long> createNewsletter(
            @RequestParam("accountId") String accountId,
            @RequestParam("templateName") String templateName,
            @RequestParam("introduction") String introduction,
            @RequestParam("conclusion") String conclusion,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            // Validate input
            if (accountId == null || accountId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            if (templateName == null || templateName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            if (introduction == null || introduction.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            if (conclusion == null || conclusion.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            final long MAX_SIZE = 15 * 1024 * 1024; // 15 MB in bytes

            // Validate image size if provided
            if (image != null && image.getSize() > MAX_SIZE) {
                return ResponseEntity.badRequest().body(null);
            }

            // Convert image to byte array if provided
            byte[] imageBytes = null;
            if (image != null) {
                imageBytes = image.getBytes();
            }

            // Create and save newsletter
            Newsletter newsletter = new Newsletter();
            newsletter.setAccountId(accountId);
            newsletter.setTemplateName(templateName);
            newsletter.setIntroduction(introduction);
            newsletter.setConclusion(conclusion);
            newsletter.setImage(imageBytes); // Save image as byte array

            System.out.println("Creating newsletter: " + newsletter);

            // Save newsletter to the database
            Newsletter savedNewsletter = newsletterService.createNewsletter(newsletter);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNewsletter.getNewsletterId());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update/{newsletterId}")
    public ResponseEntity<String> updateNewsletter(
            @PathVariable Long newsletterId, 
            @RequestBody NewsletterDTO newsletterDTO) {
        try {
            newsletterService.updateNewsletter(newsletterId, newsletterDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Newsletter updated successfully.");
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update newsletter: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<NewsletterDTO>> getAllNewsletters() {
        try {
            List<NewsletterDTO> newsletters = newsletterService.getAllNewsletters();
            return ResponseEntity.ok(newsletters);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{newsletterId}")
    public ResponseEntity<NewsletterDTO> getNewsletterById(@PathVariable Long newsletterId) {
        try {
            NewsletterDTO newsletter = newsletterService.getNewsletterById(newsletterId);
            if (newsletter != null) {
                return ResponseEntity.ok(newsletter);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{newsletterId}")
    public ResponseEntity<String> deleteNewsletter(@PathVariable Long newsletterId) {
        try {
            boolean isDeleted = newsletterService.deleteNewsletter(newsletterId);
            if (isDeleted) {
                return ResponseEntity.ok("Newsletter deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Newsletter not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete newsletter.");
        }
    }
}
