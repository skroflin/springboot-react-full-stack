/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyConfiguration {
    
    @Bean
  public OpenAPI myOpenAPI() {
    Server devServer = new Server();
    devServer.setUrl("http://localhost:8080");
    devServer.setDescription("Razvoj (DEV)");

     Contact contact = new Contact();
    contact.setName("skroflin API");

    License mitLicense = new License().name("Edukacijska licenca").url("https://unevoc.unesco.org/home/Open+Licensing+of+Educational+Resources");

    Info info = new Info()
        .title("skroflin API za Spring Boot x React (Vite) Full-stack aplikaciju.")
        .version("1.0")
        .license(mitLicense);
    
    final String securitySchemename = "bearerAuth";
    
    return new OpenAPI()
            .info(info)
            .servers(List.of(devServer))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemename))
            .components(new Components()
                    .addSecuritySchemes(securitySchemename, 
                            new SecurityScheme()
                                    .name(securitySchemename)
                                    .type(SecurityScheme.Type.HTTP)
                                    .scheme("bearer")
                                    .bearerFormat("JWT")));
  }
}