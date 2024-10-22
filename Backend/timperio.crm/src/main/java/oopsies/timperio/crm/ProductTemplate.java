package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Data
@Table(name = "newsletter_products") 
@NoArgsConstructor
@AllArgsConstructor
public class ProductTemplate implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productTemplateId; 

    // Mapping to the newsletter entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "newsletterId", referencedColumnName = "newsletterId")  // Use actual column name in Newsletter table
    private Newsletter newsletter; // Reference to Newsletter entity instead of just Long id

    private String productName;
    private double price;
    private String discountType;
    private String promoCode;
    private double discountPer;
    private double discountAmt;
    private String relatedProduct;

    @Override
    public String toString() {
        return "ProductTemplate{" +
                "newsletterId='" + (newsletter != null ? newsletter.getNewsletterId() : null) + '\'' +
                ", productName='" + productName + '\'' +
                ", price=" + price +
                ", discountType='" + discountType + '\'' +
                ", promoCode='" + promoCode + '\'' +
                ", discountPer='" + discountPer + '\'' +
                ", discountAmt=" + discountAmt +
                ", relatedProduct='" + relatedProduct + '\'' +
                '}';
    }
}
