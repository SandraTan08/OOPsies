package oopsies.timperio.crm.config;

import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import javax.sql.DataSource;

@Service
public class DatabaseInitializer {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void executeSqlScript() {
        try {
            ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator();
            resourceDatabasePopulator.addScript(new ClassPathResource("sql/deploy.sql"));
            resourceDatabasePopulator.execute(dataSource);
            System.out.println("SQL script executed successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error executing SQL script: " + e.getMessage());
        }
    }
}