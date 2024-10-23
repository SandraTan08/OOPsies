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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    private double price;

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    private String discountType;

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    private String promoCode;

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    private double discountPer;

    public double getDiscountPer() {
        return discountPer;
    }

    public void setDiscountPer(double discountPer) {
        this.discountPer = discountPer;
    }

    private double discountAmt;

    public double getDiscountAmt() {
        return discountAmt;
    }

    public void setDiscountAmt(double discountAmt) {
        this.discountAmt = discountAmt;
    }

    private String relatedProduct;
    
    public String getRelatedProduct() {
        return relatedProduct;
    }

    public void setRelatedProduct(String relatedProduct) {
        this.relatedProduct = relatedProduct;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "newsletterId")
    private Newsletter newsletter;

    public Newsletter getNewsletter() {
        return newsletter;
    }

    public void setNewsletter(Newsletter newsletter) {
        this.newsletter = newsletter;
    }

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
