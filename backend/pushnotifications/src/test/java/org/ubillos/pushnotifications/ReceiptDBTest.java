package org.ubillos.pushnotifications;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import io.github.jav.exposerversdk.ExpoPushReceiept;
import io.github.jav.exposerversdk.ExpoPushTicket;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Arrays;
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
            db.addTicket(recipients[i], ept, LocalDateTime.of(1, 1, 1, 1, 1));

            epr = new ExpoPushReceiept();
            epr.id = Integer.toString(i);
            if (i % 2 == 0) {
                epr.status = "error";
                epr.message = "mock message";
                epr.details = new ExpoPushReceiept.Details("DeviceNotRegistered");
            } else {
                epr.status = "ok";
                epr.id = Integer.toString(i);
            }
            db.addReciept(epr, LocalDateTime.of(1, 1, 1, 1, 1));
        }

        try {
            assertTrue(db.isRecipientRedFlagged("A", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertFalse(db.isRecipientRedFlagged("B", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertTrue(db.isRecipientRedFlagged("C", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertFalse(db.isRecipientRedFlagged("D", LocalDateTime.of(1, 1, 1, 1, 1)));
            assertTrue(db.isRecipientRedFlagged("E", LocalDateTime.of(1, 1, 1, 1, 1)));
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Test
    void getFlagReason() throws SQLException {
        ReceiptDB db = ReceiptDB.getInstance(TEST_DB_NAME);

        ExpoPushTicket ept1 = new ExpoPushTicket();
        ept1.status = "ok";
        ept1.id = Integer.toString(1);
        db.addTicket("A", ept1, LocalDateTime.of(1, 1, 1, 1, 1));

        ExpoPushReceiept epr1 = new ExpoPushReceiept();
        epr1.id = Integer.toString(1);
        epr1.status = "error";
        epr1.message = "mock message";
        epr1.details = new ExpoPushReceiept.Details("DeviceNotRegistered");
        db.addReciept(epr1, LocalDateTime.of(1, 1, 1, 1, 1));

        ExpoPushTicket ept2 = new ExpoPushTicket();
        ept2.status = "ok";
        ept2.id = Integer.toString(2);
        db.addTicket("A", ept2, LocalDateTime.of(1, 1, 1, 1, 1));

        ExpoPushReceiept epr2 = new ExpoPushReceiept();
        epr2.id = Integer.toString(2);
        epr2.status = "error";
        epr2.message = "mock message";
        epr2.details = new ExpoPushReceiept.Details("MessageRateExceeded");
        db.addReciept(epr2, LocalDateTime.of(1, 1, 1, 1, 1));

        assertEquals(Arrays.asList("DeviceNotRegistered", "MessageRateExceeded"), db.getFlagReasons("A"));
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

        db.removeStaleTickets(LocalDateTime.of(1, 1, 2, 1, 1, 1), 2 * 24 * 60 * 60); // Two days ttl
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

        db.removeStaleReceipts(LocalDateTime.of(1, 1, 2, 1, 1, 1), 2 * 24 * 60 * 60); // Two days ttl
        assertEquals(1, db.getTicketCount());
        assertEquals(1, db.getRecieptCount());

    }
}