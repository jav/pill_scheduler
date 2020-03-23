package org.ubillos.pushnotifications;

import jdk.management.jfr.RecordingInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushReceiept;
import org.ubillos.pushnotifications.notificationsSDK.ExpoPushTicket;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReceiptDB {
    static final long TTL = 60 * 60 * 24 * 2;
    static Map<String, ReceiptDB> instance = null;
    Connection dbConnection = null;
    Logger logger = LoggerFactory.getLogger(RecordingInfo.class);
    String dbName;

    public static ReceiptDB getInstance(String dbName) throws SQLException {
        if (instance == null)
            instance = new HashMap<>();
        instance.putIfAbsent(dbName, new ReceiptDB(dbName));
        return instance.get(dbName);
    }

    public static Path dbPathFromString(String dbName) {
        Path dbPath = Paths.get("sqlite", dbName + ".db");
        return dbPath;
    }

    public void deleteDB() {
        Path filePath = dbPathFromString(dbName);
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void deleteDB(String _dbName) {
        Path filePath = dbPathFromString(_dbName);
        try {
            Files.delete(filePath);
        } catch (NoSuchFileException e) {
            // Ignore no such file errors.
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    ReceiptDB(String _dbName) throws SQLException {
        // db parameters
        dbName = _dbName;
        Path dbPath = Paths.get("sqlite", dbName + ".db");
        String url = "jdbc:sqlite:" + dbPath.toString();
        // create a connection to the database
        dbConnection = DriverManager.getConnection(url);

        logger.info("Connection to SQLite has been established. ConnectionUrl: " + url);

        createDB(dbConnection);
        createSchema(dbConnection);
    }

    private void createDB(Connection _dbConnection) throws SQLException {
        DatabaseMetaData meta = _dbConnection.getMetaData();

        logger.info("A new database has been created, using driver: " + meta.getDriverName());
    }

    private void createSchema(Connection _dbConnection) throws SQLException {
        String sql = null;
        Statement stmt = _dbConnection.createStatement();

        sql = "CREATE TABLE IF NOT EXISTS ticket (\n"
                + " id integer DEFAULT NULL,\n"
                + " recipient text DEFAULT NULL ,\n"
                + " created TIMESTAMP NOT NULL, \n"
                + " status text NOT NULL,\n"
                + " message text DEFAULT NULL,\n"
                + " detailsError text DEFAULT NULL\n"
                + ");";
        stmt.execute(sql);

        sql = "CREATE TABLE IF NOT EXISTS receipt (\n"
                + " id integer NOT NULL,\n"
                + " created TIMESTAMP NOT NULL, \n"
                + " status text NOT NULL,\n"
                + " message text DEFAULT NULL,\n"
                + " detailsError text DEFAULT NULL\n"
                + ");";
        stmt.execute(sql);
    }

    public boolean addTicket(String recipient, ExpoPushTicket ticket, LocalDateTime creationDate) throws SQLException {
        if (recipient == null || recipient.length() <= 0)
            return false;
        if (ticket.status == null)
            return false;

        String sql = "INSERT INTO ticket(id, recipient, created, status, message, detailsError) VALUES(?,?,?,?,?,?)";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setString(1, ticket.id);
        pstmt.setString(2, recipient);
        pstmt.setTimestamp(3, Timestamp.valueOf(creationDate));
        pstmt.setString(4, ticket.status);
        pstmt.setString(5, ticket.message);
        String detailsError = null;
        if (ticket.details != null)
            detailsError = ticket.details.getError();
        pstmt.setString(6, detailsError);
        pstmt.executeUpdate();

        return true;
    }

    public long getTicketCount() throws SQLException {
        String sql = "SELECT count(*) FROM ticket";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        return rs.getInt(1);
    }

    public void addReciept(ExpoPushReceiept receipt) throws SQLException {
        addReciept(receipt, LocalDateTime.now());
    }

    public void addReciept(ExpoPushReceiept receipt, LocalDateTime creationDate) throws SQLException {
        String sql = "INSERT INTO receipt(id, created, status, message, detailsError) VALUES(?,?,?,?,?)";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setString(1, receipt.id);
        pstmt.setTimestamp(2, Timestamp.valueOf(creationDate));
        pstmt.setString(3, receipt.status);
        pstmt.setString(4, receipt.message);
        String detailsError = null;
        if (receipt.details != null)
            detailsError = receipt.details.getError();
        pstmt.setString(5, detailsError);
        pstmt.executeUpdate();
    }

    public int getRecieptCount() throws SQLException {
        String sql = "SELECT count(*) FROM receipt";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        return rs.getInt(1);
    }

    public boolean isRecipientRedFlagged(String recipient, LocalDateTime currentDate) throws SQLException {
        removeStale(currentDate, TTL);
        String sql = "SELECT count(*) as count \n"
                + "FROM ticket JOIN receipt ON ticket.id = receipt.id \n"
                + "WHERE receipt.status == 'error' AND ticket.recipient like ?";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setString(1, recipient);
        ResultSet rs = null;

        try {
            rs = pstmt.executeQuery();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        // loop through the result set
        return rs.getInt("count") > 0;
    }

    void removeStale(LocalDateTime currentDate, long secondsTTL) throws SQLException {
        removeStaleReceipts(currentDate, secondsTTL);
        removeStaleTickets(currentDate, secondsTTL);
    }

    void removeStaleReceipts(LocalDateTime currentDate, long secondsTTL) throws SQLException {
        String sql = "DELETE FROM receipt WHERE created < ?;";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setTimestamp(1, Timestamp.valueOf(currentDate.plusSeconds(secondsTTL)));
        pstmt.executeUpdate();
    }

    void removeStaleTickets(LocalDateTime currentDate, long secondsTTL) throws SQLException {
        String sql = "DELETE FROM ticket WHERE created < ?;";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setTimestamp(1, Timestamp.valueOf(currentDate.plusSeconds(secondsTTL)));
        pstmt.executeUpdate();
    }

    public List<String> getFlagReasons(String recipient) throws SQLException {

        String sql = "SELECT receipt.detailsError as error \n"
                + "FROM ticket JOIN receipt ON ticket.id = receipt.id \n"
                + "WHERE receipt.status == 'error' AND ticket.recipient like ?";
        PreparedStatement pstmt = dbConnection.prepareStatement(sql);
        pstmt.setString(1, recipient);
        ResultSet rs = null;

        try {
            rs = pstmt.executeQuery();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        List<String> errors = new ArrayList<>();
        while (rs.next()) {
            errors.add(rs.getString("error"));
        }
        return errors;
    }
}
