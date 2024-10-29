// Newsletter.java
package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "newsletter")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsletterId", nullable = false)
    private Long newsletterId;

    public Long getNewsletterId() {
        return newsletterId;
    }

    public void setNewsletterId(Long newsletterId) {
        this.newsletterId = newsletterId;
    }

    @Column(name = "templateName", length=255, nullable = false)
    private String templateName;

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    @Column(name = "accountId", nullable = false)
    private String accountId;  // Store the ID of the user who created this template

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    @Column(name = "customerName", length=255, nullable = false)
    private String customerName;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    // Use @ElementCollection to store the list of embedded ProductTemplate objects
    @OneToMany(mappedBy = "newsletter", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductTemplate> products;
    
    public List<ProductTemplate> getProducts() {
        return products;
    }   

    public void setProducts(List<ProductTemplate> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "Newsletter{" +
                "newsletterId=" + newsletterId +
                ", customerName='" + customerName + '\'' +
                ", accountId='" + accountId + '\'' +
                ", products=" + products +
                '}';
    }
}