package oopsies.timperio.crm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*; // Import JPA annotations
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId; // Assuming the primary key is "userId"

    @JsonProperty("username")
    private String username; // Username field

    @JsonProperty("department")
    private String department; // Department (Sales, Marketing, etc.)

    @JsonProperty("position")
    private String position; // Position (e.g., Manager, Specialist)

    @JsonProperty("role")
    private String role; // Role (e.g., Admin, User)


    // Optionally add the following if there are no other fields
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", department='" + department + '\'' +
                ", position='" + position + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}

