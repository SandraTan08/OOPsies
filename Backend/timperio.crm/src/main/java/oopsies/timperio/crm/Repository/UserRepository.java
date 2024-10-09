package oopsies.timperio.crm.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.User; 

public interface UserRepository extends JpaRepository<User, Integer> {
    
}
