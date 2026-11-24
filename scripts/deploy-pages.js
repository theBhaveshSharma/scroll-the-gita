/**
 * Publish dist/ to gh-pages, forcing font assets under assets/node_modules
 * (normally skipped because .gitignore matches node_modules/).
 */
const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');

ghpages.clean();

ghpages.publish(
  'dist',
  {
    branch: 'gh-pages',
    nojekyll: true,
    history: false,
    dotfiles: true,
    message: 'Deploy web build',
    async beforeAdd(git) {
      const junk = ['.gitignore', '.env.example', '.vscode'];
      for (const name of junk) {
        const full = path.join(git.cwd, name);
        if (fs.existsSync(full)) {
          fs.rmSync(full, { recursive: true, force: true });
        }
      }
      // Force-include font assets ignored by node_modules patterns
      if (fs.existsSync(path.join(git.cwd, 'assets'))) {
        await git.add(['-f', 'assets']);
      }
    },
  },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Published to gh-pages');
  }
);
