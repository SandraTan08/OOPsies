package oopsies.timperio.crm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@RestController
public class TestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/test-connection")
    public String testConnection() {
        try {
            // Load the MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            // Get a connection from the DataSource
            try (Connection connection = dataSource.getConnection()) {
                return "Database connection successful!";
            }
        } catch (ClassNotFoundException e) {
            return "Driver class not found: " + e.getMessage();
        } catch (SQLException e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}
