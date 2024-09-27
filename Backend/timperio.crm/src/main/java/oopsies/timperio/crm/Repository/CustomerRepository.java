package oopsies.timperio.crm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.Customer; 

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> { // Change Long to Integer
    // Custom query methods (if needed) can be added here
}



