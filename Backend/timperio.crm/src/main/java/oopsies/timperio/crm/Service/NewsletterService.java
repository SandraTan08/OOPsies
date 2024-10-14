package oopsies.timperio.crm.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.Newsletter;
import oopsies.timperio.crm.Repository.NewsletterRepository;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    public void saveNewsletter(Newsletter newsletter) {
        newsletterRepository.save(newsletter);
    }
}
