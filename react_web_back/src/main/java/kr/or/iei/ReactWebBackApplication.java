package kr.or.iei;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@EnableAspectJAutoProxy(proxyTargetClass = true)
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class ReactWebBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactWebBackApplication.class, args);
	}

}
