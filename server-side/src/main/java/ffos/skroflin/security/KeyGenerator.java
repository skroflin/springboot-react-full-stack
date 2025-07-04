/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ffos.skroflin.security;

import io.jsonwebtoken.io.Encoders;
import java.security.SecureRandom;

/**
 *
 * @author svenk
 */
public class KeyGenerator {
    public static void main(String[] args) {
        byte[] keyBytes = new byte[64];
        new SecureRandom().nextBytes(keyBytes);
        String base64EncodedKey = Encoders.BASE64.encode(keyBytes);
        System.out.println("Generated Base64 Secret Key: " + base64EncodedKey);
    }
}
