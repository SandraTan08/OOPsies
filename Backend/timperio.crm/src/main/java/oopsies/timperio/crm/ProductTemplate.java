// ProductTemplate.java
package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "newsletter_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;

    private String productName;

    private double price;

    private String discountType;

    private String promoCode;

    private double discountPer;

    private double discountAmt;

    private String relatedProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "newsletterId")
    private Newsletter newsletter;

    @Override
    public String toString() {
        return "ProductTemplate{" +
                "productName='" + productName + '\'' +
                ", price=" + price +
                ", discountType='" + discountType + '\'' +
                ", promoCode='" + promoCode + '\'' +
                ", discountPer=" + discountPer +
                ", discountAmt=" + discountAmt +
                ", relatedProduct='" + relatedProduct + '\'' +
                '}';
    }
}
