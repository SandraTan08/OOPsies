package oopsies.timperio.crm.Service;


import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.CustomerRepository;
import oopsies.timperio.crm.Customer; 
@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> allCustomers(){
        List<Customer> customers = customerRepository.findAll();
        System.out.println("Fetched customers: " + customers); // Debug log
        return customers;
    }
}
