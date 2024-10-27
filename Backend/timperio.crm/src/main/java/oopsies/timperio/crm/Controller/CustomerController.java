package oopsies.timperio.crm.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import oopsies.timperio.crm.TieredCustomer; // Import TieredCustomer
import oopsies.timperio.crm.Service.CustomerService;
import oopsies.timperio.crm.Service.PurchaseHistoryService;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PurchaseHistoryService purchaseHistoryService; // Inject PurchaseHistoryService

    // Endpoint to get all customers
    @GetMapping
    public ResponseEntity<List<TieredCustomer>> getAllCustomers() {
        List<TieredCustomer> customers = customerService.allCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    // Endpoint to get the first customer by ID using @RequestParam
    @GetMapping("/byCustomer")
    public ResponseEntity<TieredCustomer> getCustomerById(@RequestParam Integer customerId) {
        log.info("Fetching first customer with ID: {}", customerId);
        
        // Fetch the first customer directly
        TieredCustomer customer = customerService.getLatestCustomerById(customerId);
        
        if (customer != null) {
            log.info("Customer found: {}", customer);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } else {
            log.warn("Customer not found with ID: {}", customerId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/customerTier")
    public ResponseEntity<String> updateCustomerTier(@RequestParam Integer customerId) {
    try {
        // Fetch total price for the customer
        double totalPrice = purchaseHistoryService.getTotalPriceByCustomerId(customerId);
        log.info("Total price for customer ID {}: {}", customerId, totalPrice);
        
        // Retrieve the customer based on the customer ID
        TieredCustomer customer = customerService.getLatestCustomerById(customerId);
        if (customer == null) {
            log.warn("Customer not found with ID: {}", customerId);
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }

        // Determine the new tier based on total price
        String newTier;
        if (totalPrice > 3000) {
            newTier = "G";
        } else if (totalPrice > 1000) {
            newTier = "S";
        } else {
            newTier = "B";
        }

        // Update the tier in the customer object and save changes
        // log.info("SETTING customer tier for ID");
        // customer.setTier(newTier);
        log.info("UPDATING customer tier for ID TEEHEEE");
        customerService.updateTier(customer, newTier);
        
        log.info("Updated customer tier for ID {}: {}", customerId, newTier);
        return new ResponseEntity<>(newTier, HttpStatus.OK); // Return the new tier
    } catch (Exception e) {
        log.error("Error updating customer tier for ID {}: {}", customerId, e.getMessage(), e);
        return new ResponseEntity<>("Failed to update customer tier", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


}
