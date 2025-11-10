package com.neurofleetx.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${neurofleetx.websocket.allowedOrigins}")
    private String origins;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry r){
        r.addEndpoint("/ws").setAllowedOrigins(origins.split(",")).withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry c){
        c.enableSimpleBroker("/topic");
        c.setApplicationDestinationPrefixes("/app");
    }
}
