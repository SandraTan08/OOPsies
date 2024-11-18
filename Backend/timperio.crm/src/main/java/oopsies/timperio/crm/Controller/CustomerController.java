// CustomerController.java
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
    private PurchaseHistoryService purchaseHistoryService;

    // Endpoint to get all customers
    @GetMapping
    public ResponseEntity<List<TieredCustomer>> getAllCustomers() {
        log.info("Fetching all customers..."); // Log start of request
        try {
            List<TieredCustomer> customers = customerService.allCustomers();
            log.info("Successfully fetched customers. Count: {}", customers.size());
            return new ResponseEntity<>(customers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching all customers", e); // Log the error with stack trace
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get customers by tier
    @GetMapping("/byTier")
    public ResponseEntity<List<TieredCustomer>> getCustomersByTier(@RequestParam String tier) {
        log.info("Fetching customers with tier: {}", tier);

        List<TieredCustomer> customers = customerService.getCustomersByTier(tier);

        if (customers.isEmpty()) {
            log.warn("No customers found with tier: {}", tier);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(customers, HttpStatus.OK);
        }
    }

    @PutMapping("/customerTier")
    public ResponseEntity<String> updateCustomerTier(@RequestParam Integer customerId) {
        try {
            double totalPrice = purchaseHistoryService.getTotalPriceByCustomerId(customerId);
            log.info("Total price for customer ID {}: {}", customerId, totalPrice);

            TieredCustomer customer = customerService.getLatestCustomerById(customerId);
            if (customer == null) {
                log.warn("Customer not found with ID: {}", customerId);
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            String newTier = determineTier(totalPrice);
            customerService.updateTier(customer, newTier);

            log.info("Updated customer tier for ID {}: {}", customerId, newTier);
            return new ResponseEntity<>(newTier, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error updating customer tier for ID {}: {}", customerId, e.getMessage(), e);
            return new ResponseEntity<>("Failed to update customer tier", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String determineTier(double totalPrice) {
        if (totalPrice > 3000) {
            return "G";
        } else if (totalPrice > 1000) {
            return "S";
        } else {
            return "B";
        }
    }
}
