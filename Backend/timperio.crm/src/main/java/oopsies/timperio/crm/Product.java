package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity  // Use @Entity for JPA with MySQL
public class Product {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)  // For auto-increment ID
    private Long productID;
    private String product;
    private int variant;
    private double price;
}
