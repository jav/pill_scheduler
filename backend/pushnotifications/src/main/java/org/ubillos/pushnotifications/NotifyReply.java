package org.ubillos.pushnotifications;

import org.ubillos.pushnotifications.notificationsSDK.ExpoPushTicket;

import java.util.List;

public class NotifyReply {
    public List<ExpoPushTicket> tickets;

    public NotifyReply(List<ExpoPushTicket> _tickets) {
        tickets = _tickets;
    }

}