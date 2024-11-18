package oopsies.timperio.crm.Repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.TieredCustomer;

@Repository
public interface CustomerRepository extends JpaRepository<TieredCustomer, Integer> {
    
    // Method to find the first customer by customerId
    Optional<TieredCustomer> findFirstByCustomerId(Integer customerId);
    
    // Method to find customers by tier with non-null customerEmail
    List<TieredCustomer> findByTierAndCustomerEmailIsNotNull(String tier);

    // Custom query to fetch customers by tier with non-null and non-empty customerEmail
    @Query("SELECT c FROM TieredCustomer c WHERE c.tier = :tier AND c.customerEmail IS NOT NULL AND c.customerEmail <> ''")
    List<TieredCustomer> findByTierAndValidEmail(@Param("tier") String tier);
}
