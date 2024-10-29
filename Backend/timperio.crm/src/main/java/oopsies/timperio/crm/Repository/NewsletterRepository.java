// NewsletterRepository.java
package oopsies.timperio.crm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.Newsletter;
import java.util.List;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    List<Newsletter> findByAccountId(String accountId);
}

