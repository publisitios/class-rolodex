//Xavier Fernandez
// WDI March 28th 2015
//load required libraries
var fs = require('fs');
var net = require('net');
// data storage in JSON text 
var DATA_FILE = './data.json';
var contacts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
// Temporary object for storing contact data
var newContact = {
    active: false,
    fullname: null,
    username: null,
    email: null,
    phone: null,
    facebook: null,
    linkedin: null,
    city: null
};

// Functions 
function save(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

function changeState(state) {
    newContact.active = state;
}

// start the telnet server
var server = net.createServer();
server.on('connection', function(client) { //'connection' listener
            console.log('client connected');
            client.setEncoding('utf8');
            client.write('Hello! Welcome to the Knope rolodex!\n\n');
            client.write(" -Type 'list' to view registered contacts.\n");
            client.write(" -Type 'view' 'CONTACT' to view that person's contact details.\n");
            client.write(" -Type 'add' to register a new contact.\n");
            client.write(" -Type 'delete' 'CONTACT' to delete that contact.\n\n");
            client.write(" -Type 'exit' to close the connection to the server.\n\n");

            client.on('data', function(stringFromClient) {

                    if (newContact.active === false) {

                        console.log("received input: " + stringFromClient);
                        var input = stringFromClient.trim(); // remove nasty characters from the end of the file
                        // console.log(str1); //debuging
                        var inputArray = input.split(" "); //convert input into an array  
                        // console.log(inputArray); //debuging
                        var command = inputArray[0];
                        var username = inputArray[1];


                        // Application Controller Switch 
                        switch (command) {

                            case "list":
                                if (contacts.length > 0) {
                                    contacts.forEach(function(entry) {
                                        client.write(entry.username + "\n");
                                    });
                                } else {
                                    client.write("\nNo contacts...\n");
                                }
                                break;

                            case "view":
                                // console.log("username: " + username); // debuging
                                if (contacts.length > 0) {
                                    contacts.forEach(function(entry) {
                                        // console.log("entry.username : " + entry.username);// debuging

                                        if (entry.username === username) {
                                            client.write("Contact Full Name: " + entry.fullname + "\n");
                                            client.write("Contact E-Mail: " + entry.email + "\n");
                                            client.write("Contact Phone: " + entry.phone + "\n");
                                            client.write("Contact Facebook: " + entry.facebook + "\n");
                                            client.write("Contact Location: " + entry.city + "\n");
                                        } else {
                                            var tempArray = [];
                                            tempArray.push(entry);
                                            console.log(contacts.indexOf(entry));
                                            if (contacts.length === tempArray.length) {
                                                client.write("There is no contact " + username + " in the rolodex!\n");
                                            }
                                        }
                                    });
                                } else {
                                    client.write("\nNo contacts...\n");
                                }
                                break;

                            case "add":
                                client.write("What is the contact's Full Name :  \n");
                                changeState(true);
                                console.log(newContact.active); // debuging 
                                break;

                            case "delete":
                                    if (contacts.length > 0) {
                                        contacts.forEach(function(entry) {
                                            // console.log("entry.username : " + entry.username);// debuging

                                            if (entry.username === username) {
                                                console.log(contacts.indexOf(entry)); // debuging

                                                var indexToDelete = contacts.indexOf(entry);
                                                contacts.splice(indexToDelete, 1) 
                                                client.write("Contact info for " + username + " has been deleted!\n");
                                                console.log("Contact info for " + username + " has been deleted!\n");
                                                
                                            } else {
                                                var tempArray = [];
                                                tempArray.push(entry);
                                                console.log(contacts.indexOf(entry));
                                                if (contacts.length === tempArray.length) {
                                                    client.write("There is no contact " + username + " in the rolodex!\n");
                                                }
                                            }

                                        });
                                    } else {
                                        client.write("\nNo contacts...\n");
                                    }
                                    break;

                            case "exit":
                                client.write("Goodbye! \n");
                                client.end();
                                break;

                            default:
                            console.log("\nIncorrect command. Try `list`, `view USERNAME`, `add` or `delete`\n");
                            client.write("\nIncorrect command. Try `list`, `view USERNAME  `, `add` or `delete`\n");
                    
                        } // end switch

                        } else if (newContact.active === true) {

                            // console.log("adding new contact , received input: " + input);

                            if (newContact.fullname === null && stringFromClient.trim() != "add") {

                                console.log(stringFromClient.trim());

                                newContact.fullname = stringFromClient.trim();

                                // console.log(newContact.fullname); // debuging

                                var usernameArray = stringFromClient.trim().split(" "); //convert fullname into an array  
                                // console.log(usernameArray); //debuging
                                newContact.username = usernameArray[0]; // username is fist word of the array
                                // console.log(newContact); // debuging  

                                client.write("What is the contact's E-Mail :  \n");
                            } else if (newContact.email === null) {
                                newContact.email = stringFromClient.trim();
                                // console.log(newContact); // debuging 
                                client.write("What is the contact's LinkedIn URL :  \n");
                            } else if (newContact.linkedin === null) {
                                newContact.linkedin = stringFromClient.trim();
                                // console.log(newContact); // debuging 
                                client.write("What is the contact's Facebook URL :  \n");
                            } else if (newContact.facebook === null) {
                                newContact.facebook = stringFromClient.trim();
                                // console.log(newContact); // debuging 
                                client.write("What is the contact's Telephone :  \n");
                            } else if (newContact.phone === null) {
                                newContact.phone = stringFromClient.trim();
                                // console.log(newContact); // debuging
                                client.write("What is the contact's Location :  \n");
                            } else if (newContact.city === null) {
                                newContact.city = stringFromClient.trim();
                                if (newContact.city !== null) {
                                    console.log(newContact);
                                    contacts.push(newContact);
                                    save(contacts);
                                    client.write("\nNew Contact " + newContact.fullname + " created!\n");
                                    changeState(false);
                                }
                            }
                        } // end else if 
                    }); // end client.on
            }); //end server.on
        server.listen(8124, function() { //'listening' listener
            console.log('rolodex server is running');
        });