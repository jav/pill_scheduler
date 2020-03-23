package org.ubillos.pushnotifications;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushMessage;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushTicket;
import org.ubillos.pushnotifications.notificationsSDK.PushClient;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@RestController
public class PushnotificationsController {
    static final String DB_NAME = "RecieptDB";

    Logger logger = LoggerFactory.getLogger(PushnotificationsController.class);

    /*
     *  curl localhost:8080/notify -X POST -H "Content-type: application/json " -d '{"to":["ExponentPushToken[xyz]"], "title":"foobar"}
     */

    @PostMapping(path = "/notify", consumes = "application/json", produces = "application/json")
    public NotifyReply notify(
            @RequestBody(required = false) NotifyRequestBody notifyRequest) throws SQLException {
        logger.info("notifyRequest:" + notifyRequest.toString());
        ReceiptDB notFinalReceiptDB = null;
        try {
            notFinalReceiptDB = ReceiptDB.getInstance(DB_NAME);
        } catch (SQLException e) {
            e.printStackTrace();
            return new NotifyReply("Error: could not get DB instance");
        }
        final ReceiptDB receiptDB = notFinalReceiptDB;

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

        if (notifyRequest.title != null)
            epm.title = notifyRequest.title;
        if (notifyRequest.subtitle != null)
            epm.subtitle = notifyRequest.subtitle;
        if (notifyRequest.body != null)
            epm.body = notifyRequest.body;
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
