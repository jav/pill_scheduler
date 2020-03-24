package org.ubillos.pushnotifications;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import io.github.jav.exposerversdk.ExpoPushMessage;
import io.github.jav.exposerversdk.ExpoPushTicket;
import io.github.jav.exposerversdk.PushClient;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@RestController
public class PushnotificationsController {
    static final String DB_NAME = "ReceiptDB";

    Logger logger = LoggerFactory.getLogger(PushnotificationsController.class);

    /*
     *  curl localhost:8080/notify -X POST -H "Content-type: application/json " -d '{"to":["ExponentPushToken[xyz]"], "title":"foobar"}
     */

    @PostMapping(path = "/notify", consumes = "application/json", produces = "application/json")
    public NotifyReply notify(
            @RequestBody(required = false) NotifyRequestBody notifyRequest) throws SQLException {

        logger.info("notifyRequest:" + notifyRequest.toString());

        ReceiptDB receiptDB = null;
        try {
            receiptDB = ReceiptDB.getInstance(DB_NAME);
        } catch (SQLException e) {
            e.printStackTrace();
            return new NotifyReply("Error: could not get DB instance");
        }

        final PushClient client = new PushClient();

        List<ExpoPushMessage> messages = new ArrayList<>();
        List<String> invalidRecipients = new ArrayList<>();
        List<FlaggedRecipients> flaggedRecipients = new ArrayList<>();

        ExpoPushMessage epm = new ExpoPushMessage();

        for (String recipient : notifyRequest.to) {
            if (!PushClient.isExponentPushToken(recipient)) {
                invalidRecipients.add(recipient);
            } else if (receiptDB.isRecipientRedFlagged(recipient, LocalDateTime.now())) {
                flaggedRecipients.add(new FlaggedRecipients(recipient, receiptDB.getFlagReasons(recipient)));
            } else {
                epm.to.add(recipient);
            }
        }

        epm.title = notifyRequest.title;
        epm.subtitle = notifyRequest.subtitle;
        epm.body = notifyRequest.body;
        epm.data = notifyRequest.data;
        epm.sound = notifyRequest.sound;
        epm.ttl = notifyRequest.ttl;
        epm.expiration = notifyRequest.expiration;
        epm.setPriority(notifyRequest.priority);
        epm.badge = notifyRequest.badge;
        epm.channelId = notifyRequest.channelId;

        messages.add(epm);

        List<List<ExpoPushMessage>> chunks = client.chunkPushNotifications(messages);

        List<CompletableFuture<List<ExpoPushTicket>>> messageRepliesFutures = new ArrayList<>();
        for (List<ExpoPushMessage> chunk : chunks) {
            messageRepliesFutures.add(client.sendPushNotificationsAsync(chunk));
        }

        // Wait for each completable future to finish
        List<ExpoPushTicket> allTickets = new ArrayList<>();
        for (CompletableFuture<List<ExpoPushTicket>> messageReplyFuture : messageRepliesFutures) {
            try {
                for (ExpoPushTicket ticket : messageReplyFuture.get()) {
                    allTickets.add(ticket);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }

        return new NotifyReply(allTickets, invalidRecipients, flaggedRecipients);
    }
}
