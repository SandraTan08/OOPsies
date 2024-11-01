// NewsletterService.java
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
import java.util.List;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @Autowired
    private ProductTemplateRepository productTemplateRepository;

    public List<NewsletterDTO> getNewslettersByAccountId(String accountId) {
        List<Newsletter> newsletters = newsletterRepository.findByAccountId(accountId);
        List<NewsletterDTO> newsletterDTOs = new ArrayList<>();

        for (Newsletter newsletter : newsletters) {
            NewsletterDTO dto = new NewsletterDTO();
            dto.setNewsletterId(newsletter.getNewsletterId());
            dto.setTemplateName(newsletter.getTemplateName());
            dto.setAccountId(newsletter.getAccountId());
            dto.setCustomerName(newsletter.getCustomerName());

            List<ProductTemplateDTO> productDTOs = new ArrayList<>();
            for (ProductTemplate product : newsletter.getProducts()) {
                ProductTemplateDTO productDTO = new ProductTemplateDTO();
                productDTO.setProductName(product.getProductName());
                productDTO.setPrice(product.getPrice());
                productDTOs.add(productDTO);
            }
            dto.setProducts(productDTOs);
            newsletterDTOs.add(dto);
        }
        return newsletterDTOs;
    }

    public void saveNewsletter(Newsletter newsletter, HttpSession session) {
        // Retrieve the accountId and customerName from the session or newsletter object
        String accountId = newsletter.getAccountId();
        String customerName = newsletter.getCustomerName();

        // Validate if the accountId and customerName are present
        if (accountId == null) {
            throw new IllegalArgumentException("Account ID not found in session or newsletter.");
        }
        if (customerName == "[Customer Name]" || customerName == null) {
            throw new IllegalArgumentException("Customer name not provided.");
        }

        // Detach the product list from the newsletter before saving the newsletter
        List<ProductTemplate> products = newsletter.getProducts();
        newsletter.setProducts(null); // Temporarily detach the product list

        // Step 1: Save the newsletter first (without products)
        Newsletter savedNewsletter = newsletterRepository.save(newsletter);

        // Step 2: Now associate each product with the saved newsletter and save the
        // products
        if (products != null && !products.isEmpty()) {
            for (ProductTemplate product : products) {
                // Associate each product with the saved newsletter
                product.setNewsletter(savedNewsletter);
            }
            // Save all the associated product templates
            productTemplateRepository.saveAll(products);

            // Step 3: Re-attach the products to the newsletter if needed
            savedNewsletter.setProducts(products);
        }
    }

    public NewsletterDTO getNewsletterById(Long newsletterId) {
        // Logic to retrieve the newsletter from the database
        // You would typically use a repository here to find the newsletter by ID
        Newsletter newsletter = newsletterRepository.findByNewsletterId(newsletterId);
    
        return convertToDTO(newsletter); // Convert the entity to a DTO
    }
    
    private NewsletterDTO convertToDTO(Newsletter newsletter) {
        // Conversion logic from Newsletter to NewsletterDTO
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

        return new NewsletterDTO(
            newsletter.getNewsletterId(),
            newsletter.getTemplateName(),
            newsletter.getAccountId(),
            newsletter.getCustomerName(),
            productDTOs
        );
    }
}
