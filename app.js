// solitaire game

// read line stuff (this is nodejs but is all that needs changing if converting to other javascript stuff
var readlineSync = require('readline-sync');
function readline(str) {
    return readlineSync.question(str);
}

// set up game and functions

// array of all ranks
var ranks = [
    "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
];

// array of all suits
var suits = [
    "Spades", "Hearts", "Clubs", "Diamonds"
];

// using ranks and suits, create virtual deck of cards
var deck = createDeck();
var sideDeck = [];

var hand = [];
var handSize = 3;

shuffle(deck);

var slots = [];
var slotSize = 7;

var stacks = {};

var unicode = true;

// set up stacks
// for each suit
for (var i = 0; i < suits.length; i++) {
    // create a stack for that suit
    stacks[suits[i]] = [];
}

// clear chat
function clearChat() {
    // run console.log("") 100 times
    for (var i = 0; i < 100; i++) {
        console.log("");
    }
}

// can card stack on card
function canStack(card) {
    var rank = card.rank;
    var stack = stacks[card.suit];

    // get top card of stack
    var topCard = stack[stack.length - 1];

    // if top card is undefined and card suit is "A", return true
    if (topCard === undefined) {
        if (rank == "A")
            return true;
        else
            return false
    }

    // if card next rank is equal to topCard rank then return true
    if (getNextRank(topCard.rank) == card.rank)
        return true;
    return false;
}

// add card to stack
function addCardToStack(card) {
    var suit = card.suit;
    var rank = card.rank;

    var stack = stacks[suit];
    stack.push(card);
}
    
    

// create deck
function createDeck() {
    var deck = [];

    for (var i = 0; i < ranks.length; i++) {
        for (var j = 0; j < suits.length; j++) {
            deck.push({ rank: ranks[i], suit: suits[j] });
        }
    }

    return deck;
}

// get next rank
function getNextRank(rank) {
    var index = ranks.indexOf(rank);
    if (index == -1) {
        return "";
    }
    if (index == ranks.length - 1) {
        return ranks[0];
    }
    return ranks[index + 1];
}

// shuffle deck
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// get top of deck and remove it
function deal(deck) {
    // if deck doesn't have cards, return null;
    if (deck.length == 0)
        return null;

    var topCard = deck.pop();
    return topCard;
}

// flip card
function flip(card) {
    if (card.faceUp) {
        card.faceUp = false;
    } else {
        card.faceUp = true;
    }
}

// create slots
for (var i = 0; i < slotSize; i++) {
    slots[i] = [];
    for (var j = 0; j < i + 1; j++) {
        slots[i].push(deal(deck));

        if (j === 0) {
            slots[i][j].faceUp = true;
        }
    }
}

// is suit black?
function isBlack(suit) {
    return suit === "Spades" || suit === "Clubs";
}

// get last element of array at index in slots
function getLast(slots, index) {
    return slots[index][0];
}

// can card sit on card
function canSit(bottomCard, topCard) {
    if (!(topCard && bottomCard)) return false;
    var colour = false;
    if (isBlack(bottomCard.suit) != isBlack(topCard.suit)) {
        colour = true;
    }
    
    var rank = false;
    if (getNextRank(topCard.rank) == bottomCard.rank) {
        rank = true;
    }

    return colour && rank;
}

// can card be placed in slot
function canPlace(card, slot) {

    if (slots[slot].length == 0) {
        if (card.rank == "K")
            return true;
        return false;
    }

    return canSit(getLast(slots, slot), card);
}

// place card in slot
function place(card, slot) {
    slots[slot].unshift(card);
}

var emptyCard = `______
|    |
|    |
|    |
`+ (unicode ? "\u203E\u203E\u203E\u203E\u203E\u203E" : "------")

var unknownCard = `______
|????|
|????|
|????|
`+ (unicode ? "\u203E\u203E\u203E\u203E\u203E\u203E" : "------")

// create card unicode art
function createCard(card) {
    // if card isn't faceUp
    if (!card.faceUp) {
        return unknownCard;

    }

    var cardText = (card.rank != "10" ? `______
|R  S|
|    |
|S  R|
` + (unicode ? "\u203E\u203E\u203E\u203E\u203E\u203E" : "------") : `______
|R S|
|    |
|S R|
`+ (unicode ? "\u203E\u203E\u203E\u203E\u203E\u203E" : "------"));
    var s;
    switch(card.suit) {
        case "Spades":
            s = (unicode ? "\u2660" : "S");
            break;
        case "Hearts":
            s = (unicode ? "\u2665" : "H");
            break;
        case "Clubs":
            s = (unicode ? "\u2663" : "C");
            break;
        case "Diamonds":
            s = (unicode ? "\u2666" : "D");
            break;
    }

    var r = card.rank;

    // replace all instances of "R" with rank
    cardText = cardText.replace(/R/g, r);

    // replace all instances of "S" with rank
    cardText = cardText.replace(/S/g, s);

    // if card is black, replace all spaces with a "/"
    if (isBlack(card.suit)) {
        cardText = cardText.replace(/ /g, "/");
    }

    return cardText;
}

// stack cards unicode art
function stackCards(cardTextBottom, cardTextTop) {
    // keep first three lines of cardTextBottom
    var cardTextBottomLines = cardTextBottom.split("\n");
    var cardTextBottomLines = cardTextBottomLines.slice(0, 2);
    var cardTextBottom = cardTextBottomLines.join("\n");
    

    cardTextBottom += "\n" + cardTextTop;
    // place cardTextTop after first "\n" in cardTextBottom
    //cardTextBottom = cardTextBottom.replace(/\n/, cardTextTop + "\n");


    return cardTextBottom;
}

//create stack of cards
function createStackOfCards(cards) {
    if (cards.length == 0)
        return emptyCard;

    // loop each card, save cardText
    var cardText = "";
    for (var i = 0; i < cards.length; i++) {
        if (cardText == "")
            cardText = createCard(cards[i]);
        else
            cardText = stackCards(createCard(cards[i]), cardText);
    }

    return cardText;
}

function sideBySideText(left, right) {
    var leftText = left.split("\n");
    var rightText = right.split("\n");
    var sideBySideText = "";

    // find which is bigger, left or right and use that that length
    var maxLength = Math.max(leftText.length, rightText.length);

    for (var i = 0; i < maxLength; i++) {
        if (leftText[i])
            sideBySideText += leftText[i] += "   ";
        else {
            // get length of first in leftText array
            var leftTextLength = leftText[0].length;
            // add spaces to the end of the string
            if (leftTextLength > 0) {
                sideBySideText += " ".repeat(leftTextLength - 1) + " ";
            }
        }
        if (rightText[i])
            sideBySideText += rightText[i];
        else {
            // get length of first in rightText array
            var rightTextLength = rightText[0].length;
            // add spaces to the end of the string
            if (rightTextLength > 0) {
                sideBySideText += " ".repeat(rightTextLength - 1) + " ";
            }
        }
        sideBySideText += "\n";
    }

    return sideBySideText;
}

// add slot number to bottom of stack of cards
function addNumber(stackOfCards, number) {
    var numberText = "  " + number + (number < 10 ? "   " : "  ");

    stackOfCards += "\n" + numberText;

    return stackOfCards;
}
    

// print all slots
function getAllSlotsText() {
    var slotText = "";
    for (var i = 0; i < slots.length; i++) {
        // if slotText is "", set slotText to createStackOfCards(slots[i]);
        var stackOfCards = addNumber(createStackOfCards(slots[i]), i);

        if (slotText == "")
            slotText = stackOfCards;
        else
            slotText = sideBySideText(slotText, stackOfCards);
    }

    return slotText;
}

// get deck text
function getDeckText() {
    var deckText = "";
    for (var i = 0; i < deck.length; i++) {
        if (deckText == "")
            deckText = createCard(deck[i]);
        else
            deckText = stackCards(createCard(deck[i]), deckText);
    }
    
    return deckText;
}

// fill hand
function fillHand() {
    // if deck is empty, move cards from sideDeck
    if (deck.length == 0) {
        // move cards from sideDeck to deck
        deck = sideDeck;
        // empty sideDeck
        sideDeck = [];
    }

    for (var i = 0; i < handSize; i++) {
        var card = deal(deck);
        if (card != null) {
            flip(card);
            hand.push(card);
        }
    }
}

// put hand back to start of deck array
function putHandBack() {
    // foreach card in hand
    for (var i = 0; i < hand.length; i++) {
        // put card to start of deck array
        flip(hand[i]);
        sideDeck.unshift(hand[i]);
    }

    // empty hand
    hand = [];
}

// get hand text
function getHandText() {
    var handText = "";
    for (var i = 0; i < hand.length; i++) {
        if (handText == "")
            handText = createCard(hand[i]);
        else
            handText = stackCards(createCard(hand[i]), handText);
    }
    
    return handText;
}

// get all stacks text
function getAllStacksText() {
    var stacksText = "";

    // foreach entry and value in stacks
    for (var entry in stacks) {
        var cards = stacks[entry];
        
        var cardText = emptyCard;
        
        // if cards is not empty
        if (cards.length > 0) {
            // get top card
            var topCard = cards[cards.length - 1];
            // get card text
            cardText = createCard(topCard);
        }

        if (stacksText == "") {
            stacksText = cardText;
        } else {
            stacksText = sideBySideText(stacksText, cardText);
        }
    }

    return stacksText
}

// isInteger is string integer
function isInteger(n) {
    return (n % 1 === 0);
}
    

// show game
function showGame() {
    clearChat();
    console.log(sideBySideText(deck.length > 0 ? unknownCard : emptyCard, sideBySideText(getHandText(), sideBySideText("      ", getAllStacksText()))));
    console.log(getAllSlotsText());
}

// print help menu
function printHelp() {
    clearChat();
    console.log("Each column is called a 'slot'.");
    console.log("The 4 stacks of cards are called 'stacks'.")
    console.log("The three cards at the top are your 'hand'.")
    console.log("- You can move the top card from your hand to a slot by simply by typing the slot number.")
    console.log("- Press enter with no command to cycle the hand from the deck.")
    console.log("- Move cards from one slot to another by using 'slot <from slot #> <to slot #>'.")
    console.log("- Move the top card of your hand or a slot to a stack by using 'stack <from slot # / hand>'.")
    console.log("")
    console.log("If you run into any problems, open an issue on the github.");
    console.log("");
    console.log("PRESS ENTER TO RETURN TO GAME");
}

// initiate game

fillHand();

var errorMessage = "Welcome to solitaire, use 'help' to view help menu.";

while(true) {
    showGame();
    console.log(errorMessage);
    var input = readline('What is your next move?      ');
    errorMessage = "";
    // if input is "quit", break
    if (input == "quit" || input == "exit")
        break;

    // if input is "", next hand
    if (input == "") {
        putHandBack();
        fillHand();
        continue;
    }

    // get card at top of hand
    var card = hand[0];

    if (parseInt(input) < slotSize) {
        if (canPlace(card, parseInt(input))) {
            place(card, parseInt(input));
            hand.shift();
        }
        else {
            errorMessage = "Invalid move!";
        }

        continue;
    }

    // get input command
    var command = input.split(" ");
    
    // if command is "stack", get the first argument
    if (command[0] == "stack" || command[0] == "s") {
        // if command has two arguments
        if (command.length == 2) {
            // if command[1] is integer and is in range of slots
            if (isInteger(command[1]) && parseInt(command[1]) >= 0 && parseInt(command[1]) < slotSize) {
                var fromSlot = slots[parseInt(command[1])];

                // get top card in fromSlot
                var topCard = fromSlot[0];
                
                //if topCard is not empty and can go to stack
                if (topCard != null && canStack(topCard)) {
                    // place topCard to stack
                    addCardToStack(topCard);
                    // remove topCard from fromSlot
                    fromSlot.shift();

                    // if fromSlot top card isn't flipped, flip it
                    if (fromSlot[0] && !fromSlot[0].faceUp)
                        flip(fromSlot[0]);
                } else {
                    errorMessage = "Invalid move!"
                }
                continue;
            }

            // if command[1] is "hand" or "h"
            if (command[1] == "hand" || command[1] == "h") {
                // get top card in fromSlot
                var topCard = hand[0];

                if (topCard != null && canStack(topCard)) {
                    // place topCard to stack
                    addCardToStack(topCard);
                    // remove topCard from hand
                    hand.shift();

                    // if hand top card isn't flipped, flip it
                    if (hand[0] && !hand[0].faceUp)
                        flip(hand[0]);
                } else {
                    errorMessage = "Invalid move!"
                }

                continue;
            }

            errorMessage = "Invalid syntax: stack <card # / hand>"
        } else {
            errorMessage = "Invalid syntax: stack <card # / hand>"
        }

        continue;
    }

    // if command is "move", get the first and second arguments
    if (command[0] == "move" || command[0] == "m" || command[0] == "mov") {
        // if command has three arguments
        if (command.length == 3) {
            // if command[1] is integer and is in range of slots
            if (isInteger(command[1]) && parseInt(command[1]) >= 0 && parseInt(command[1]) < slotSize) {
                // if command[2] is integer and is in range of slots
                if (isInteger(command[2]) && parseInt(command[2]) >= 0 && parseInt(command[2]) < slotSize) {
                    // move card from one slot to another

                    var fromSlot = slots[parseInt(command[1])];

                    var toMove = [];
                    var canMove = false;
                    // loop cards in slot referenced by first argument, if the card can sit on the top card, remove each card from the card and put in slot referenced by second argument
                    for (var i = fromSlot.length - 1; i >= 0; i--) {
                        var card = fromSlot[i];
                        
                        if (card.faceUp) {
                            if (canPlace(card, parseInt(command[2]))) {
                                canMove = true;
                            }

                            if (canMove) {
                                toMove.push(card);
                            }
                        }
                    }

                    if (canMove) {
                        // remove cards contained in toMove from fromSlot
                        for (var i = 0; i < toMove.length; i++) {
                            fromSlot.splice(fromSlot.indexOf(toMove[i]), 1);
                        }

                        // add cards in toMove to slot referenced by second argument
                        for (var i = 0; i < toMove.length; i++) {
                            slots[parseInt(command[2])].unshift(toMove[i]);
                        }

                        // if fromSlot top card isn't flipped, flip it
                        if (fromSlot[0] && !fromSlot[0].faceUp)
                            flip(fromSlot[0]);
                        
                        } else {
                        errorMessage = "Invalid move!"
                    }
                } else {
                    errorMessage = "Invalid syntax: move <slot #> <slot #>"
                }
            } else {
                errorMessage = "Invalid syntax: move <slot #> <slot #>"
            }
        } else {
            errorMessage = "Invalid syntax: move <slot #> <slot #>"
        }

        continue;
    }

    // if command is "help", print list of commands
    if (command[0] == "help" || command[0] == "h") {
        printHelp();
        readline("");
        continue;
    }
    errorMessage = "Unknown command! Say 'help' for list of commands."
}

