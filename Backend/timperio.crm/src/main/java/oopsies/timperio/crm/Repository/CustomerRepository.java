package oopsies.timperio.crm.Repository;

import java.util.Optional; // Correct import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.TieredCustomer; // Use TieredCustomer

@Repository
public interface CustomerRepository extends JpaRepository<TieredCustomer, Integer> {
    
    // Method to find the first customer by customerId
    Optional<TieredCustomer> findFirstByCustomerId(Integer customerId); // Return Optional
}
