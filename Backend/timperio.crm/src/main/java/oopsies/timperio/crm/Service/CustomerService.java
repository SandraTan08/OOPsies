package oopsies.timperio.crm.Service;

import java.util.List;

import java.util.Optional; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.TieredCustomer; // Import TieredCustomer
import oopsies.timperio.crm.Repository.CustomerRepository;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<TieredCustomer> allCustomers() {
        return customerRepository.findAll();
    }

    public TieredCustomer getLatestCustomerById(Integer customerId) {
        Optional<TieredCustomer> optionalCustomer = customerRepository.findFirstByCustomerId(customerId);
        return optionalCustomer.orElse(null);
    }
    
    // Add a method to update the tier
    public void updateTier(TieredCustomer customer, String newTier) {
        customer.setTier(newTier);
        customerRepository.save(customer);
    }
}
