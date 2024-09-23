package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*; // Import JPA annotations

@Entity
@Table(name = "Customer") // This will map to a MySQL "Customer" table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY) // Use this to automatically generate unique IDs
    private Long customerId; // Use Long instead of ObjectId for MySQL

    private String zipcode; // Renamed to follow Java naming conventions (camelCase)
}
