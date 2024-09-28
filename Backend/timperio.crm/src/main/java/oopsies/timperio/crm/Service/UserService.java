package oopsies.timperio.crm.Service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import oopsies.timperio.crm.Repository.UserRepository;
import oopsies.timperio.crm.User; 

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    // Fetch all users
    public List<User> allCustomers() {
        List<User> users = userRepository.findAll();
        System.out.println("Fetched customers: " + users); // Debug log
        return users;
    }

    // Fetch user by ID
    public Optional<User> getUserById(Integer userId) {  // Use Integer to match repository
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            System.out.println("Fetched customer: " + user.get()); // Debug log
        } else {
            System.out.println("User with ID " + userId + " not found."); // Debug log for not found case
        }
        return user;
    }

    // Save a new user
    public User save(User user) {
        return userRepository.save(user); // Persist the user to the database
    }
}
