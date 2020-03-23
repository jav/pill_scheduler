package org.ubillos.pushnotifications;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializable;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushTicket;

import java.io.IOException;
import java.util.List;

public class NotifyReply implements JsonSerializable {
    public List<ExpoPushTicket> tickets;
    public List<String> invalidRecipients;
    public List<FlaggedRecipients> flaggedRecipients;

    public String error = null;

    public NotifyReply(List<ExpoPushTicket> _tickets,
                       List<String> _invalidRecipients,
                       List<FlaggedRecipients> _flaggedRecipients) {
        tickets = _tickets;
        invalidRecipients = _invalidRecipients;
        flaggedRecipients = _flaggedRecipients;
    }

    public NotifyReply(String _error) {
        error = _error;
    }


    @Override
    public void serialize(JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        if (error != null) {
            jsonGenerator.writeStringField("error", error);
        } else {
            jsonGenerator.writeArrayFieldStart("tickets");
            for (ExpoPushTicket t : tickets) {
                jsonGenerator.writeObject(t);
            }
            jsonGenerator.writeEndArray();
        }
        jsonGenerator.writeEndObject();
        return;
    }

    @Override
    public void serializeWithType(JsonGenerator jsonGenerator, SerializerProvider serializerProvider, TypeSerializer typeSerializer) throws IOException {
        throw new UnsupportedOperationException("serializeWithType() not implemented.");
    }
}

