package oopsies.timperio.crm.Service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.AccountRepository;
import oopsies.timperio.crm.Account; 

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // Initialize BCryptPasswordEncoder for hashing passwords
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Fetch all accounts
    public List<Account> allAccounts(){
        List<Account> accounts = accountRepository.findAll();
        System.out.println("Fetched accounts: " + accounts); // Debug log
        return accounts;
    }

    // Get account by ID
    public Optional<Account> getAccountById(String accountID) {
        return accountRepository.findById(accountID);
    }

    // Create a new account with hashed password
    public Account createAccount(Account account) {
        try {
            // Hash the password before saving
            String hashedPassword = passwordEncoder.encode(account.getPassword());
            account.setPassword(hashedPassword);
            
            return accountRepository.save(account);
        } catch (Exception e) {
            // Log the error and throw a new exception
            System.out.println("Error saving account: " + e.getMessage());
            throw e; // Rethrow the exception to be caught by the global handler
        }
    }

    // Delete account by ID
    public boolean deleteAccount(String accountID) {
        Optional<Account> account = accountRepository.findById(accountID);
        if (account.isPresent()) {
            accountRepository.deleteById(accountID);
            return true;
        } else {
            return false;
        }
    }

    // Update account by ID, hash password if it's updated
    public Account updateAccount(String accountID, Account updatedAccount) {
        // Use the default findById to check if the account exists
        return accountRepository.findById(accountID).map(existingAccount -> {
            // Update fields using Lombok's generated setter methods
            existingAccount.setAccountUserName(updatedAccount.getAccountUserName());
            existingAccount.setAccountEmail(updatedAccount.getAccountEmail());
            
            // If the password is updated, hash it before saving
            if (updatedAccount.getPassword() != null && !updatedAccount.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(updatedAccount.getPassword());
                existingAccount.setPassword(hashedPassword);
            }
            
            existingAccount.setRole(updatedAccount.getRole());
    
            // Save the updated account using the default save method
            return accountRepository.save(existingAccount);
        }).orElse(null);  // Return null if account not found
    }
}
