package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*; // Import JPA annotations
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "staffaccount")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @JsonProperty("accountId")
    private String AccountID;

    @JsonProperty("accountUserName")
    private String AccountUserName;

    @JsonProperty("password")
    private String Password;

    @JsonProperty("accountEmail")
    private String AccountEmail;

    @JsonProperty("role")
    private String Role;


    // Corrected toString method with proper field names
    public String toString() {
        return "Account{" +
                "accountId='" + AccountID + '\'' +
                ", accountUserName='" + AccountUserName + '\'' +
                ", password='" + Password + '\'' +
                ", accountEmail='" + AccountEmail + '\'' +
                ", role='" + Role + '\'' +
                '}';
    }
    
}
