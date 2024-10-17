package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Embeddable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTemplate {

    private String productName;
    private double price;
    private String discountType;
    private String promoCode;
    private double discountAmount;
    private String relatedProduct;

    @Override
    public String toString() {
        return "ProductTemplate{" +
                "productName='" + productName + '\'' +
                ", price=" + price +
                ", discountType='" + discountType + '\'' +
                ", promoCode='" + promoCode + '\'' +
                ", discountAmount=" + discountAmount +
                ", relatedProduct='" + relatedProduct + '\'' +
                '}';
    }
}
