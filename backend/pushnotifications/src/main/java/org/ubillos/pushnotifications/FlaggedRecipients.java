package org.ubillos.pushnotifications;

import java.util.List;

public class FlaggedRecipients {
    public String recipient;
    public List<String> flagReasons;

    public FlaggedRecipients() {};
    public FlaggedRecipients(String _recipient, List<String> _flagReasons) {
        recipient = _recipient;
        flagReasons = _flagReasons;
    }

}
