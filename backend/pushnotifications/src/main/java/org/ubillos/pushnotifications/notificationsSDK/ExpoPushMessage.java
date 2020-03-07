package org.ubillos.pushnotifications.notificationsSDK;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ExpoPushMessage {

    List<String> to;

    Map<String, String> data = null;
    String title = "";
    String subtitle = "";
    String body = "";
    ExpoMessageSound sound = new ExpoMessageSound();
    long ttl = -1;
    long expiration = -1;
    String priority = "";
    long badge = -1;
    String channelId = "";

    public ExpoPushMessage() {
        to = new ArrayList<>();
    }

    public ExpoPushMessage(List<String> _to, ExpoPushMessage _message) {
        to = _to;
        data = _message.data;
        title = _message.title;
        subtitle = _message.subtitle;
        body = _message.body;
        sound = _message.sound;
        ttl = _message.ttl;
        expiration = _message.expiration;
        priority = _message.priority;
        badge = _message.badge;
        channelId = _message.channelId;
    }

    public ExpoPushMessage(List<String> _to) {
        to = _to;
    }

    public ExpoPushMessage(String _to) {
        to = Arrays.asList(_to);
    }
};

