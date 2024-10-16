package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*; // Import JPA annotations
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    
    @Id
    @JsonProperty("customerId")
    private Integer customerId;

    @JsonProperty("zipCode")
    private Integer zipCode;

    // Optionally add the following if there are no other fields
    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", zipCode=" + zipCode +
                '}';
    }
}
