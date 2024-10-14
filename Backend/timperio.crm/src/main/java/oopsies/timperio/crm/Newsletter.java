package oopsies.timperio.crm;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "newsletter")
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate ID
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "product1_name", nullable = false)
    private String product1Name;

    @Column(name = "product1_price", nullable = false)
    private double product1Price;

    @Column(name = "product1_discount")
    private double product1Discount; // Nullable

    @Column(name = "product1_promo_code")
    private String product1PromoCode; // Nullable

    @Column(name = "product2_name")
    private String product2Name;

    @Column(name = "product2_price")
    private double product2Price;

    @Column(name = "product3_name")
    private String product3Name;

    @Column(name = "product3_price")
    private double product3Price;

    @Column(name = "product3_discount_amount")
    private double product3DiscountAmount; // Nullable

    @Column(name = "product3_related_product")
    private String product3RelatedProduct; // Nullable

}