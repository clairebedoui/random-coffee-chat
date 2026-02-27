function pairCoffeeChat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Load participants (now includes filter for 'Yes' in col A)
  const participantsSheet = ss.getSheetByName('Participants');
  const participantsData = participantsSheet.getRange('A2:C' + participantsSheet.getLastRow()).getValues();
  
  // Filter only those marked "Yes" in col A
  const activeParticipants = participantsData
    .filter(row => row[0] && row[0].toString().toLowerCase() === 'yes')
    .map(row => [row[1], row[2]]); // keep only [Name, Email]
  
  if (activeParticipants.length < 2) {
    Logger.log("Not enough participants marked 'Yes' for pairing.");
    return;
  }
  
  // Load past pairings
  const pastPairingsSheet = ss.getSheetByName('Past pairings');
  const pastData = pastPairingsSheet.getRange('A2:D' + pastPairingsSheet.getLastRow()).getValues();
  
  // Track past pairs
  const pastPairsSet = new Set(pastData.map(row => [row[0], row[1]].sort().join('|')));
  
  // Track past unpaired people
  const unpairedHistory = pastData.map(row => row[2]).filter(Boolean);
  
  // Shuffle participants
  const shuffled = shuffleArray(activeParticipants.slice());
  
  const pairs = [];
  const usedIndexes = new Set();
  let unpairedPerson = null;
  
  // If odd number, pick someone to be unpaired this month who hasn't been unpaired recently
  if (shuffled.length % 2 !== 0) {
    for (let i = 0; i < shuffled.length; i++) {
      if (!unpairedHistory.includes(shuffled[i][0])) {
        unpairedPerson = shuffled[i];
        usedIndexes.add(i);
        break;
      }
    }
    // fallback: pick first participant
    if (!unpairedPerson) {
      unpairedPerson = shuffled[0];
      usedIndexes.add(0);
    }
  }
  
  // Create pairs avoiding repeats
  for (let i = 0; i < shuffled.length; i++) {
    if (usedIndexes.has(i)) continue;
    
    let paired = false;
    for (let j = i + 1; j < shuffled.length; j++) {
      if (usedIndexes.has(j)) continue;
      
      const candidatePair = [shuffled[i][0], shuffled[j][0]].sort().join('|');
      if (!pastPairsSet.has(candidatePair)) {
        pairs.push([shuffled[i], shuffled[j]]);
        usedIndexes.add(i);
        usedIndexes.add(j);
        paired = true;
        break;
      }
    }
    
    // If no new pair possible, pair with next available
    if (!paired) {
      for (let j = i + 1; j < shuffled.length; j++) {
        if (!usedIndexes.has(j)) {
          pairs.push([shuffled[i], shuffled[j]]);
          usedIndexes.add(i);
          usedIndexes.add(j);
          break;
        }
      }
    }
  }
  
  // Log pairings in Past pairings
  const now = new Date();
  const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yy');
  
  pairs.forEach(pair => {
    pastPairingsSheet.appendRow([pair[0][0], pair[1][0], "", formattedDate]);
  });
  
  if (unpairedPerson) {
    pastPairingsSheet.appendRow(["", "", unpairedPerson[0], formattedDate]);
  }
  
  // Send emails to pairs
  pairs.forEach(pair => {
    const [name1, email1] = pair[0];
    const [name2, email2] = pair[1];
    
    const subject = "Your Coffee Chat Pair for This Month! ☕";
    const message = `Hi ${name1} and ${name2},\n\n` +
                    "You've been paired for this month's coffee chat! Please take a moment to " +
                    "schedule a time that works best for both of you.\n\n" +
                    "Best,\nYour Coffee Chat Bot";
    
    MailApp.sendEmail(email1, subject, message);
    MailApp.sendEmail(email2, subject, message);
  });
  
  // Email unpaired person
  if (unpairedPerson) {
    const [name, email] = unpairedPerson;
    const subject = "Coffee Chat Update ☕";
    const message = `Hi ${name},\n\n` +
                    "This month, we had an odd number of participants, so unfortunately you won't be paired for a coffee chat this month. " +
                    "Don't worry — next month you'll have a partner!\n\n" +
                    "Best,\nYour Coffee Chat Bot";
    
    MailApp.sendEmail(email, subject, message);
  }
  
  Logger.log("Pairing and emails completed!");
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
