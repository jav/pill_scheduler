package org.ubillos.pushnotifications.notificationsSDK;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

public class PushClient {
    static public final long PUSH_NOTIFICATION_CHUNK_LIMIT = 100;
    static public final long PUSH_NOTIFICATION_RECEIPT_CHUNK_LIMIT = 300;


    static public boolean isExponentPushToken(String token) {
        String prefixA = "ExponentPushToken[";
        String prefixB = "ExpoPushToken[";
        String postfix = "]";
        String mockRegex = "/^[a-z\\d]{8}/i";
        String regex = "[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}";

        if (token.matches(regex)) return true;

        if (!token.endsWith(postfix)) return false;
        if (token.startsWith(prefixA)) return true;
        if (token.startsWith(prefixB)) return true;
        return false;
    }

    public static long _getActualMessagesCount(List<ExpoPushMessage> messages) {
        return messages.stream().reduce(0, (acc, cur) -> acc + cur.to.size(), Integer::sum);
    }

    public List<List<String>> chunkPushNotificationReceiptIds(List<String> recieptIds) {
        return _chunkItems(recieptIds, PUSH_NOTIFICATION_RECEIPT_CHUNK_LIMIT);
    }

    public <T> List<List<T>> _chunkItems(List<T> items, long chunkSize) {
        List<List<T>> chunks = new ArrayList<>();
        List<T> chunk = new ArrayList<>();
        for (T item : items) {
            chunk.add(item);
            if (chunk.size() >= chunkSize) {
                chunks.add(chunk);
                chunk = new ArrayList<>();
            }
        }

        if (chunk.size() > 0) {
            chunks.add(chunk);
        }
        return chunks;
    }

    public List<List<ExpoPushMessage>> chunkPushNotifications(List<ExpoPushMessage> messages) {
        List<List<ExpoPushMessage>> chunks = new ArrayList<>();
        List<ExpoPushMessage> chunk = new ArrayList<>();

        long chunkMessagesCount = 0;
        for (ExpoPushMessage message : messages) {
            List<String> partialTo = new ArrayList<>();
            for (String recipient : message.to) {
                if(recipient.length() <= 0) continue;
                partialTo.add(recipient);
                chunkMessagesCount++;
                if (chunkMessagesCount >= PUSH_NOTIFICATION_CHUNK_LIMIT) {
                    // Cap this chunk here if it already exceeds PUSH_NOTIFICATION_CHUNK_LIMIT.
                    // Then create a new chunk to continue on the remaining recipients for this message.
                    chunk.add(new ExpoPushMessage(partialTo, message));
                    chunks.add(chunk);
                    chunk = new ArrayList<>();
                    chunkMessagesCount = 0;
                    partialTo = new ArrayList<>();
                }
            }

            if (partialTo.size() > 0) {
                chunk.add(new ExpoPushMessage(partialTo, message));
            }

            if (chunkMessagesCount >= PUSH_NOTIFICATION_CHUNK_LIMIT) {
                // Cap this chunk if it exceeds PUSH_NOTIFICATION_CHUNK_LIMIT.
                // Then create a new chunk to continue on the remaining messages.
                chunks.add(chunk);
                chunk = new ArrayList<>();
                chunkMessagesCount = 0;
            }
        }

        if (chunkMessagesCount > 0) {
            // Add the remaining chunk to the chunks.
            chunks.add(chunk);
        }

        return chunks;
    }
}
