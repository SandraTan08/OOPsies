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
    private String introduction;
    private String conclusion;
    private String image; // Base64-encoded image
    private String base64Image;
    private List<ProductTemplateDTO> products;
}