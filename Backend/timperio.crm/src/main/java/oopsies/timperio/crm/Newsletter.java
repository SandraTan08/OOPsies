// Newsletter.java
package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "newsletter")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long newsletterId;

    private String templateName;

    private String accountId;  // Store the ID of the user who created this template

    private String customerName;

    @OneToMany(mappedBy = "newsletter", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductTemplate> products;

    private String introduction;  // Store the ID of the user who created this template

    private String conclusion;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] image;  // Storing image as byte array

    @Override
    public String toString() {
        return "Newsletter{" +
                "newsletterId=" + newsletterId +
                ", customerName='" + customerName + '\'' +
                ", accountId='" + accountId + '\'' +
                ", introduction='" + introduction + '\'' +
                ", conclusion='" + conclusion + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}