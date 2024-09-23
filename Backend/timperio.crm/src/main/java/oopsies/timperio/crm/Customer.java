package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*; // Import JPA annotations

@Entity
@Table(name = "customer") // This will map to a MySQL "Customer" table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    //@Column(name = "customerId")
    private Integer customerId; // Change to Integer if you prefer to match MySQL's int


    //@Column(name = "zipCode") // Ensure case matches
    private Integer zipCode; // Change to Integer for consistency

}
