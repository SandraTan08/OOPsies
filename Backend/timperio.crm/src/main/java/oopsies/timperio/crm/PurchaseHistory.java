package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "PurchaseHistory") // Maps to the "PurchaseHistory" table in MySQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistory {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY) // Automatically generates unique ID
    private Long purchaseId;

    @Temporal(TemporalType.DATE)
    private Date saleDate;

    private int saleType;
    private boolean digital; // Changed to boolean for true/false
    
    private Long customerId;
    private String shippingMethod;

    private Long productId;
    private int quantity;
    private double totalPrice;
}
