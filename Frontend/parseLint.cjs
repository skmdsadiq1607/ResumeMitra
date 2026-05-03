const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint.json'));
data.forEach(file => {
  if (file.errorCount > 0) {
    console.log(file.filePath);
    file.messages.forEach(msg => {
      console.log('  Line ' + msg.line + ': ' + msg.message + ' (' + msg.ruleId + ')');
    });
  }
});
