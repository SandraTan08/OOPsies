package oopsies.timperio.crm.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpSession;
import oopsies.timperio.crm.Repository.NewsletterRepository;
import oopsies.timperio.crm.Newsletter;
import oopsies.timperio.crm.ProductTemplate;
import oopsies.timperio.crm.Repository.ProductTemplateRepository;
import oopsies.timperio.crm.dto.NewsletterDTO;
import oopsies.timperio.crm.dto.ProductTemplateDTO;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @Autowired
    private ProductTemplateRepository productTemplateRepository;

    public List<NewsletterDTO> getAllNewsletters() {
        List<Newsletter> newsletters = newsletterRepository.findAll();
        return newsletters.stream()
                .map(this::convertToDTO) // Custom mapping method
                .toList();
    }

    public Newsletter createNewsletter(Newsletter newsletter) {
        System.out.println("Creating newsletter: " + newsletter);
        // Validate basic fields
        if (newsletter.getTemplateName() == null || newsletter.getTemplateName().trim().isEmpty()) {
            throw new IllegalArgumentException("Template name is required.");
        }

        if (newsletter.getAccountId() == null ||
                newsletter.getAccountId().trim().isEmpty()) {
            throw new IllegalArgumentException("Please sign in to update newsletter.");
        }

        if (newsletter.getIntroduction() == null || newsletter.getIntroduction().trim().isEmpty()) {
            throw new IllegalArgumentException("Introduction is required.");
        }

        if (newsletter.getConclusion() == null || newsletter.getConclusion().trim().isEmpty()) {
            throw new IllegalArgumentException("Conclusion is required.");
        }

        if (newsletter.getImage() != null && newsletter.getImage().length > 15 * 1024 * 1024) { // 15 MB limit
            throw new IllegalArgumentException("File size exceeds the limit");
        }

        // Save the newsletter
        return newsletterRepository.save(newsletter);
    }

    public void updateNewsletter(Long newsletterId, Newsletter updatedNewsletter, HttpSession session) {
        // Fetch the existing newsletter by ID
        Optional<Newsletter> optionalNewsletter = newsletterRepository.findById(newsletterId);
        if (optionalNewsletter.isEmpty()) {
            throw new IllegalArgumentException("Newsletter with ID " + newsletterId + " not found.");
        }

        Newsletter existingNewsletter = optionalNewsletter.get();

        // Retrieve and validate session or newsletter details
        String accountId = (String) session.getAttribute("accountId");
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new IllegalArgumentException("Please sign in to update newsletter.");
        }

        String customerName = updatedNewsletter.getCustomerName();
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required.");
        }

        String templateName = updatedNewsletter.getTemplateName();
        if (templateName == null || templateName.trim().isEmpty()) {
            throw new IllegalArgumentException("Template name is required.");
        }

        // Update existing fields
        existingNewsletter.setTemplateName(templateName);
        existingNewsletter.setCustomerName(customerName);

        // Detach and update products if provided
        List<ProductTemplate> products = updatedNewsletter.getProducts();
        if (products != null && !products.isEmpty()) {
            // Clear existing products to avoid duplicates
            productTemplateRepository.deleteAll(existingNewsletter.getProducts());

            for (ProductTemplate product : products) {
                product.setNewsletter(existingNewsletter); // Associate each product with the newsletter
            }

            // Save the new product list
            productTemplateRepository.saveAll(products);
            existingNewsletter.setProducts(products);
        }

        // Save the updated newsletter
        newsletterRepository.save(existingNewsletter);
    }

    public boolean deleteNewsletter(Long newsletterId) {
        if (newsletterRepository.existsById(newsletterId)) {
            newsletterRepository.deleteById(newsletterId);
            return true;
        }
        return false;
    }

    public NewsletterDTO getNewsletterById(Long newsletterId) {
        // Retrieve the newsletter from the database
        Newsletter newsletter = newsletterRepository.findByNewsletterId(newsletterId);
        return convertToDTO(newsletter); // Convert the entity to a DTO
    }

    private NewsletterDTO convertToDTO(Newsletter newsletter) {
        if (newsletter == null) {
            return null;
        }

        List<ProductTemplateDTO> productDTOs = new ArrayList<>();
        for (ProductTemplate product : newsletter.getProducts()) {
            ProductTemplateDTO productDTO = new ProductTemplateDTO();
            productDTO.setTemplateId(product.getTemplateId());
            productDTO.setProductName(product.getProductName());
            productDTO.setPrice(product.getPrice());
            productDTO.setDiscountType(product.getDiscountType());
            productDTO.setPromoCode(product.getPromoCode());
            productDTO.setDiscountPer(product.getDiscountPer());
            productDTO.setDiscountAmt(product.getDiscountAmt());
            productDTO.setRelatedProduct(product.getRelatedProduct());
            productDTOs.add(productDTO);
        }

        // Convert the image to Base64 if it exists
        String base64Image = null;
        if (newsletter.getImage() != null) {
            base64Image = Base64.getEncoder().encodeToString(newsletter.getImage());
        }

        NewsletterDTO dto = new NewsletterDTO();
        dto.setNewsletterId(newsletter.getNewsletterId());
        dto.setTemplateName(newsletter.getTemplateName());
        dto.setAccountId(newsletter.getAccountId());
        dto.setCustomerName(newsletter.getCustomerName());
        dto.setIntroduction(newsletter.getIntroduction());
        dto.setConclusion(newsletter.getConclusion());
        dto.setImage(base64Image); // Set Base64 image in the DTO
        dto.setProducts(productDTOs);

        return dto;
    }
}
