package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate; // Import LocalDate instead of Date

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "purchasehistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("purchaseId")
    private Long purchaseId;

    @Column(name = "saleDate")
    @JsonProperty("saleDate")
    private LocalDate saleDate; // Using LocalDate for better handling

    @JsonProperty("saleType")
    private int saleType;
    @JsonProperty("digital")
    private int digital; 
    @JsonProperty("customerId")
    private Long customerId;
    @JsonProperty("shippingMethod")
    private String shippingMethod;
    @JsonProperty("productId")
    private Long productId;
    @JsonProperty("quantity")
    private int quantity;
    @JsonProperty("totalPrice")
    private double totalPrice;

    @Override
    public String toString() {
        return "PurchaseHistory{" +
                "purchaseId=" + purchaseId +
                ", saleDate=" + saleDate +
                ", saleType=" + saleType +
                ", digital=" + digital +
                ", customerId=" + customerId +
                ", shippingMethod='" + shippingMethod + '\'' +
                ", productId=" + productId +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                '}';
    }

    public double getTotalPrice() {
        return totalPrice;
    }
}
