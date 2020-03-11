package org.ubillos.pushnotifications.notificationsSDK;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializable;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ubillos.pushnotifications.PushnotificationsController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class ExpoPushTicket implements JsonSerializable {
    public String status = null;
    public String id = null;
    public String message = null;
    public String details = null;

    Logger logger = LoggerFactory.getLogger(ExpoPushTicket.class);

    ExpoPushTicket() {
    }


    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    ExpoPushTicket(@JsonProperty("status") String _status,
                   @JsonProperty("id") String _id,
                   @JsonProperty("message") String _message,
                   @JsonProperty("details") String _details) {
        status = _status;
        id = _id;
        message = _message;
        setDetails(_details);
    }

    public ExpoPushTicket(String json) {

        logger.info("ExpoPushTicket string:" + json);

    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String _details) {
        String[] errorDetailsKeys = new String[]{"DeviceNotRegistered", "InvalidCredentials", "MessageTooBig", "MessageRateExceeded"};
        List<String> errorDetailsKeysList = Arrays.asList(errorDetailsKeys);
        if (_details != null && !errorDetailsKeysList.contains(_details)) {
            throw new IllegalArgumentException("Member \"details\" but be one of :" + errorDetailsKeys);
        }
        details = _details;
    }

    @Override
    public void serialize(JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("status", status);
        if(status.equals("ok")) {
               jsonGenerator.writeStringField("id", id);

        }
        else {
            jsonGenerator.writeStringField("message", message);
            jsonGenerator.writeStringField("details", details);
        }
        jsonGenerator.writeEndObject();
        return;
    }

    @Override
    public void serializeWithType(JsonGenerator jsonGenerator, SerializerProvider serializerProvider, TypeSerializer typeSerializer) throws IOException {
        throw new UnsupportedOperationException("serializeWithType() not implemented.");
    }
}