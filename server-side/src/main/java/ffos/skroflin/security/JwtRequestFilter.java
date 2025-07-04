package ffos.skroflin.security;

import ffos.skroflin.service.KorisnikUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final KorisnikUserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    public JwtRequestFilter(KorisnikUserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // --- LOGOVI ZA DEBUGGING ---
        System.out.println("\n--- JWT Filter Processing Request ---");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization Header: " + (authorizationHeader != null ? authorizationHeader.substring(0, Math.min(authorizationHeader.length(), 50)) + "..." : "null")); // Ispis prvih 50 znakova
        // --- KRAJ LOGOVA ---

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtTokenUtil.extractUsername(jwt);
                // --- LOGOVI ZA DEBUGGING ---
                System.out.println("Extracted Username from Token: " + username);
                // --- KRAJ LOGOVA ---
            } catch (ExpiredJwtException e) {
                System.err.println("JWT Token has expired for " + request.getRequestURI() + ": " + e.getMessage());
            } catch (SignatureException e) {
                System.err.println("Invalid JWT Signature for " + request.getRequestURI() + ": " + e.getMessage());
                e.printStackTrace(); // VAŽNO: Ispis stoga greške
            } catch (Exception e) {
                System.err.println("Error extracting JWT for " + request.getRequestURI() + ": " + e.getMessage());
                e.printStackTrace(); // VAŽNO: Ispis stoga greške
            }
        } else {
            System.out.println("Authorization Header missing or invalid for " + request.getRequestURI());
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            // --- LOGOVI ZA DEBUGGING ---
            System.out.println("Loaded UserDetails Username: " + userDetails.getUsername());
            System.out.println("Loaded UserDetails Authorities: " + userDetails.getAuthorities());
            // --- KRAJ LOGOVA ---

            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                // --- LOGOVI ZA DEBUGGING ---
                System.out.println("Authentication successful for user: " + username);
                // --- KRAJ LOGOVA ---
            } else {
                System.err.println("JWT Token validation failed after userDetails load for: " + username);
            }
        } else if (username == null) {
            System.out.println("Username is null (token not parsed or found) for " + request.getRequestURI());
        } else {
            System.out.println("User is already authenticated for " + request.getRequestURI() + ". Current user: " + SecurityContextHolder.getContext().getAuthentication().getName());
        }
        
        chain.doFilter(request, response);
        System.out.println("--- JWT Filter Finished Processing Request for " + request.getRequestURI() + " ---\n");
    }
}