const { exec } = require('child_process');
const fs = require('fs');

exec('git status', (error, stdout, stderr) => {
    const output = `Error: ${error}\nStdout: ${stdout}\nStderr: ${stderr}`;
    fs.writeFileSync('node_git_status.txt', output);
});
