package oopsies.timperio.crm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.Customer; 

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Custom query methods (if needed) can be added here
}
