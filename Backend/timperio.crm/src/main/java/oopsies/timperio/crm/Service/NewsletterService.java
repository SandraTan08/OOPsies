package oopsies.timperio.crm.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import oopsies.timperio.crm.Repository.NewsletterRepository;
import oopsies.timperio.crm.Newsletter;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    // Method to save a newsletter
    public void saveNewsletter(Newsletter newsletter, HttpSession session) {
        // Retrieve the accountId from the session
        String accountId = (String) session.getAttribute("accountId");

        // Check if accountId is present
        if (accountId == null) {
            throw new IllegalArgumentException("Account ID not found in session.");
        }

        // Set the accountId as the creator of the newsletter
        newsletter.setUserId(accountId);

        // Save the newsletter to the database
        newsletterRepository.save(newsletter);
    }
}