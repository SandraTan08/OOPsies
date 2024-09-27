package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity  // Use @Entity for JPA with MySQL
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // For auto-increment ID
    @JsonProperty("productId")
    private Long productId;
    @JsonProperty("productName")
    private String productName;
    @JsonProperty("variant")
    private int variant;
    @JsonProperty("price")
    private double price;

    @Override
    public String toString() {
        return "Product{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", variant=" + variant +
                ", price=" + price +
                '}';
    }
}
