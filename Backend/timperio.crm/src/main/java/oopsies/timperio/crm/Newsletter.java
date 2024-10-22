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
    @Column(name = "newsletterId")
    private Long newsletterId;

    @Column(name = "accountId")
    private String accountId;  // Store the ID of the user who created this template

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountId() {
        return accountId;
    }

    @Column(name = "customerName")
    private String customerName;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    @ElementCollection
    @CollectionTable(name = "newsletter_products", joinColumns = @JoinColumn(name = "newsletterId"))
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
