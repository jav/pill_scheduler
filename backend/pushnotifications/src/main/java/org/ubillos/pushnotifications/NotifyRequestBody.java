package org.ubillos.pushnotifications;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.jav.exposerversdk.ExpoMessageSound;
import io.github.jav.exposerversdk.ExpoPushReceiept;

import java.util.List;
import java.util.Map;

public class NotifyRequestBody {
    public List<String> to = null;
    public String title = null;
    public String subtitle = null;
    public String body = null;
    public Map<String, String> data = null;
    public ExpoMessageSound sound = null;
    public long ttl = -1;
    public long expiration = -1;
    public String priority = null;
    public long badge = -1;
    public String channelId = null;

    NotifyRequestBody(@JsonProperty("to") List<String> _to,
                      @JsonProperty("title") String _title,
                      @JsonProperty("subtitle") String _subtitle,
                      @JsonProperty("body") String _body,
                      @JsonProperty("data") Map<String, String> _data,
                      @JsonProperty("sound") ExpoMessageSound _sound,
                      @JsonProperty("ttl") long _ttl,
                      @JsonProperty("expiration") long _expiration,
                      @JsonProperty("priority") String _priority,
                      @JsonProperty("badge") long _badge,
                      @JsonProperty("channelId") String _chanelId) {
        to = _to;
        title = _title;
        subtitle = _subtitle;
        body = _body;
        data = _data;
        sound = _sound;
        ttl = _ttl;
        expiration = _expiration;
        priority = _priority;
        badge = _badge;
        channelId = _chanelId;
    }
}
