package org.ubillos.pushnotifications;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushReceiept;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushTicket;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ReceiptDBTest {

    static final String TEST_DB_NAME = "testDB-" + UUID.randomUUID().toString() + ".sqlitedb";

    @BeforeEach
    public void beforeEachTestMethod() {
        ReceiptDB.deleteDB(TEST_DB_NAME);
    }

    @AfterEach
    public void afterEachTestMethod() {
        ReceiptDB.deleteDB(TEST_DB_NAME);
    }

    @Test
    void addTicket() throws SQLException {

        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);
        ExpoPushTicket ept = new ExpoPushTicket();
        ept.status = "ok";
        db.addTicket("-",
                ept,
                LocalDateTime.of(1, 1, 1, 1, 1));
        assertEquals(1, db.getTicketCount());
        assertEquals(0, db.getRecieptCount());
    }

    @Test
    void addReciept() throws SQLException {
        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);
        ExpoPushReceiept ert = new ExpoPushReceiept();
        ert.id = Integer.toString(1);
        ert.status = "ok";
        db.addReciept(ert,
                LocalDateTime.of(1, 1, 1, 1, 1));
        assertEquals(1, db.getRecieptCount());
        assertEquals(0, db.getTicketCount());
    }

    @Test
    void isRecipientRedFlagged() throws SQLException {
        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);
        ExpoPushTicket ept = null;
        ExpoPushReceiept epr = null;
        // i%2 == 0 => "ERROR", i%2 == 1 => "OK" message,
        String[] recipients = new String[]{"A", "B", "C", "D", "E"};
        for (int i = 0; i < recipients.length; i++) {
            ept = new ExpoPushTicket();
            ept.status = "ok";
            ept.id = Integer.toString(i);
            db.addTicket(recipients[i], ept, LocalDateTime.of(1,1,1,1,1));

            epr = new ExpoPushReceiept();
            epr.id = Integer.toString(i);
            if(i%2==0) {
                epr.status = "error";
                epr.message = "mock message";
                epr.details = new ExpoPushReceiept.Details("DeviceNotRegistered");
            } else {
                epr.status = "ok";
                epr.id = Integer.toString(i);
            }
            db.addReciept(epr, LocalDateTime.of(1,1,1,1,1));
        }

        try {
            assertTrue( db.isRecipientRedFlagged("A", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertFalse(db.isRecipientRedFlagged("B", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertTrue( db.isRecipientRedFlagged("C", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertFalse( db.isRecipientRedFlagged("D", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertTrue(db.isRecipientRedFlagged("E", LocalDateTime.of(1, 1, 1, 1, 1)));
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Test
    void removeStaleTickets() throws SQLException {
        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);
        ExpoPushTicket ept = new ExpoPushTicket();
        ept.status = "ok";
        db.addTicket("-",
                ept,
                LocalDateTime.of(2000, 1, 1, 1, 1));

        ept = new ExpoPushTicket();
        ept.status = "ok";
        db.addTicket("-",
                ept,
                LocalDateTime.of(1, 1, 1, 1, 1));

        ExpoPushReceiept ert = new ExpoPushReceiept();
        ert.id = Integer.toString(1);
        ert.status = "ok";
        db.addReciept(ert,
                LocalDateTime.of(2000, 1, 1, 1, 1));

        assertEquals(2, db.getTicketCount());
        assertEquals(1, db.getRecieptCount());

        db.removeStaleTickets(LocalDateTime.of(1,1,2,1,1,1), 2*24*60*60); // Two days ttl
        assertEquals(1, db.getTicketCount());
        assertEquals(1, db.getRecieptCount());
    }

    @Test
    void removeStaleReciepts() throws SQLException {
        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);
        ExpoPushTicket ept = new ExpoPushTicket();
        ept.status = "ok";
        db.addTicket("-",
                ept,
                LocalDateTime.of(2000, 1, 1, 1, 1));

        ExpoPushReceiept ert = new ExpoPushReceiept();
        ert.id = Integer.toString(1);
        ert.status = "ok";
        db.addReciept(ert,
                LocalDateTime.of(2000, 1, 1, 1, 1));

        ert = new ExpoPushReceiept();
        ert.id = Integer.toString(2);
        ert.status = "ok";
        db.addReciept(ert,
                LocalDateTime.of(1, 1, 1, 1, 1));


        assertEquals(1, db.getTicketCount());
        assertEquals(2, db.getRecieptCount());

        db.removeStaleReceipts(LocalDateTime.of(1,1,2,1,1,1), 2*24*60*60); // Two days ttl
        assertEquals(1, db.getTicketCount());
        assertEquals(1, db.getRecieptCount());

    }
}