package oopsies.timperio.crm.Service;

import java.util.List;
import java.util.Optional;  // Import Optional
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.Customer;
import oopsies.timperio.crm.Repository.CustomerRepository;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> allCustomers() {
        return customerRepository.findAll();
    }

    public Customer getLatestCustomerById(Integer customerId) {
        return customerRepository.findFirstByCustomerId(customerId);
    }
}
