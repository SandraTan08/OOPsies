package oopsies.timperio.crm.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.TieredCustomer;
import oopsies.timperio.crm.Repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
    
    @Autowired
    private CustomerRepository customerRepository;

    public List<TieredCustomer> allCustomers() {
        log.info("Fetching all customers from the database...");
        List<TieredCustomer> customers = customerRepository.findAll();
        log.info("Fetched {} customers from the database", customers.size());
        return customers;
    }

    public TieredCustomer getLatestCustomerById(Integer customerId) {
        Optional<TieredCustomer> optionalCustomer = customerRepository.findFirstByCustomerId(customerId);
        return optionalCustomer.orElse(null);
    }

    // Fetch customers by tier with non-null and non-empty customerEmail
    public List<TieredCustomer> getCustomersByTier(String tier) {
        log.info("Fetching customers with tier '{}' and valid email...", tier);
        List<TieredCustomer> customers = customerRepository.findByTierAndValidEmail(tier);
        log.info("Fetched {} customers with tier '{}' and valid email", customers.size(), tier);
        return customers;
    }
    
    // Update the tier of a customer
    public void updateTier(TieredCustomer customer, String newTier) {
        customer.setTier(newTier);
        customerRepository.save(customer);
    }
}
