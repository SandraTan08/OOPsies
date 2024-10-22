package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "newsletter")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsletterId")
    private Long newsletterId;

    public Long getNewsletterId() {
        return newsletterId;
    }

    public void setNewsletterId(Long newsletterId) {
        this.newsletterId = newsletterId;
    }

    @Column(name = "accountId")
    private String accountId;  // Store the ID of the user who created this template

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    @Column(name = "customerName")
    private String customerName;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    // One-to-many relationship to ProductTemplate
    @OneToMany(mappedBy = "newsletter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductTemplate> products;  // Store product details as part of the newsletter

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
