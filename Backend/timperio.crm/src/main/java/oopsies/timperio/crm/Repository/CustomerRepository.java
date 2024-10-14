package oopsies.timperio.crm.Repository;

import org.apache.el.stream.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    
    // Method to find the first customer by customerId
    Customer findFirstByCustomerId(Integer customerId);
}
