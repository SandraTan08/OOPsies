package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*; // Import JPA annotations
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@Entity
@Table(name = "staffaccount")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Account {

    @Id
    @JsonProperty("accountId")
    private String AccountID;

    public void setAccountId(String AccountID) {
        this.AccountID = AccountID;
    }
    public String setAccountId() {
        return AccountID;
    }

    @JsonProperty("accountUserName")
    private String AccountUserName;

    public void setAccountUserName(String accountUserName) {
        this.AccountUserName = accountUserName;
    }
    public String getAccountUserName() {
        return AccountUserName;
    }

    @JsonProperty("password")
    private String Password;

    public void setPassword(String Password) {
        this.Password = Password;
    }
    public String getPassword() {
        return Password;
    }

    @JsonProperty("accountEmail")
    private String AccountEmail;

    public void setAccountEmail(String AccountEmail) {
        this.AccountEmail = AccountEmail;
    }
    public String getAccountEmail() {
        return AccountEmail;
    }

    @JsonProperty("role")
    private String Role;

    public void setRole(String Role) {
        this.Role = Role;
    }
    public String getRole() {
        return Role;
    }


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
