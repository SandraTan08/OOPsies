// ProductTemplateDTO.java
package oopsies.timperio.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductTemplateDTO {
    private Long templateId;
    private String productName;
    private double price;
    private String discountType;
    private String promoCode;
    private double discountPer;
    private double discountAmt;
    private String relatedProduct;
}