package oopsies.timperio.crm.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import oopsies.timperio.crm.Customer;
import oopsies.timperio.crm.Service.CustomerService;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    // Endpoint to get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.allCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    // Endpoint to get the first customer by ID using @RequestParam
    @GetMapping("/byCustomer")
    public ResponseEntity<Customer> getCustomerById(@RequestParam Integer customerId) {
        log.info("Fetching first customer with ID: {}", customerId);
        
        // Fetch the first customer directly
        Customer customer = customerService.getLatestCustomerById(customerId);
        
        if (customer != null) {
            log.info("Customer found: {}", customer);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } else {
            log.warn("Customer not found with ID: {}", customerId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
