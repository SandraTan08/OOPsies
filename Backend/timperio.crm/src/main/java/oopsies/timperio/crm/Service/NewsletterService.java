package oopsies.timperio.crm.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.Repository.NewsletterRepository;
import oopsies.timperio.crm.Newsletter;
import oopsies.timperio.crm.ProductTemplate;
import oopsies.timperio.crm.dto.NewsletterDTO;
import oopsies.timperio.crm.dto.ProductTemplateDTO;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

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

    public void updateNewsletter(Long newsletterId, NewsletterDTO newsletterDTO) {
        // Fetch the existing newsletter by ID
        Newsletter existingNewsletter = newsletterRepository.findById(newsletterId)
                .orElseThrow(() -> new RuntimeException("Newsletter not found with ID: " + newsletterId));
    
        // Update only specific fields
        if (newsletterDTO.getCustomerName() != null) {
            existingNewsletter.setCustomerName(newsletterDTO.getCustomerName());
        }
        if (newsletterDTO.getAccountId() != null) {
            existingNewsletter.setAccountId(newsletterDTO.getAccountId());
        }
    
        // Clear the existing products and update with new ones
        if (newsletterDTO.getProducts() != null) {
            existingNewsletter.getProducts().clear();
            for (ProductTemplateDTO productDTO : newsletterDTO.getProducts()) {
                ProductTemplate product = new ProductTemplate();
                product.setProductName(productDTO.getProductName());
                product.setPrice(productDTO.getPrice());
                product.setDiscountType(productDTO.getDiscountType());
                product.setPromoCode(productDTO.getPromoCode());
                product.setDiscountPer(productDTO.getDiscountPer());
                product.setDiscountAmt(productDTO.getDiscountAmt());
                product.setRelatedProduct(productDTO.getRelatedProduct());
                product.setNewsletter(existingNewsletter); // Set parent relationship
    
                existingNewsletter.getProducts().add(product);
            }
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
