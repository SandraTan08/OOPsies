package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate; // Import LocalDate instead of Date

@Entity
@Table(name = "purchasehistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseId;

    @Column(name = "saleDate")
    private LocalDate saleDate; // Using LocalDate for better handling

    private int saleType;
    private int digital; 
    private Long customerId;
    private String shippingMethod;
    private Long productId;
    private int quantity;
    private double totalPrice;
}
