package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer") // Make sure your database table structure supports this
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TieredCustomer extends Customer {
    
    @Column(name = "tier") // This assumes there's a 'tier' column in the 'customer' table
    private String tier; // "Gold", "Silver", "Bronze"

    @Override
    public String toString() {
        return "TieredCustomer{" +
                "customerId=" + getCustomerId() +
                ", zipCode=" + getZipCode() +
                ", tier='" + tier + '\'' +
                '}';
    }

    // The setter for 'tier' is redundant since Lombok generates it automatically
    // You can remove this method unless you have specific logic to include.
    public void setTier(String tier) {
        this.tier = tier;
     }
}
