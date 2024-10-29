// NewsletterDTO.java
package oopsies.timperio.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class NewsletterDTO {
    private Long newsletterId;
    private String templateName;
    private String accountId;
    private String customerName;
    private List<ProductTemplateDTO> products;
}