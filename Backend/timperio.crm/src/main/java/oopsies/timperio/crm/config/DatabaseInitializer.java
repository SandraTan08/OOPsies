package oopsies.timperio.crm.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.boot.CommandLineRunner;

import javax.sql.DataSource;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

            // Replace "your_database" with the actual name of your database
            String databaseName = "oop";

            // Check if the database exists
            String checkDatabaseQuery = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?";
            Integer count = jdbcTemplate.queryForObject(checkDatabaseQuery, Integer.class, databaseName);

            if (count == null || count == 0) {
                jdbcTemplate.execute("CREATE DATABASE " + databaseName);
                System.out.println("Database " + databaseName + " created successfully.");
            } else {
                System.out.println("Database " + databaseName + " already exists.");
            }

            // Execute the deploy.sql script
            ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator();
            resourceDatabasePopulator.addScript(new ClassPathResource("sql/deploy.sql"));
            resourceDatabasePopulator.execute(dataSource);

            System.out.println("SQL script executed successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error initializing database: " + e.getMessage());
        }
    }
}
